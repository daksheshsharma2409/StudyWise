import express from "express";
import { prisma } from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import { attachUserIfPresent } from "../middleware/optionalAuth.js";
import { getResourceOrderBy } from "../utils/sort.js";

const router = express.Router();

// GET /api/users/:id - public profile
router.get("/:id", attachUserIfPresent, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                bio: true,
                linkedinUrl: true,
                githubUrl: true,
                instagramUrl: true,
                customWebsiteUrl: true,
                qualifications: true,
                isVerified: true,
                role: true,
                reputationScore: true,
                createdAt: true,
            },
        });

        if (!user) return res.status(404).json({ error: "User not found." });

        const [resourceCount, followerCount, followingCount, existingFollow] =
            await Promise.all([
                prisma.resource.count({ where: { userId: id } }),
                prisma.follow.count({ where: { followingId: id } }),
                prisma.follow.count({ where: { followerId: id } }),
                req.user
                    ? prisma.follow.findUnique({
                          where: {
                              followerId_followingId: {
                                  followerId: req.user.userId,
                                  followingId: id,
                              },
                          },
                      })
                    : null,
            ]);

        res.status(200).json({
            user: {
                ...user,
                resourceCount,
                followerCount,
                followingCount,
                isFollowing: !!existingFollow,
                isOwnProfile: req.user?.userId === id,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile." });
    }
});

// GET /api/users/:id/resources?sort=recent|top|views
router.get("/:id/resources", async (req, res) => {
    try {
        const { id } = req.params;
        const resources = await prisma.resource.findMany({
            where: { userId: id },
            orderBy: getResourceOrderBy(req.query.sort),
            include: {
                subject: { select: { id: true, name: true } },
                votes: true,
            },
        });
        res.status(200).json({ resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user's resources." });
    }
});

// PATCH /api/users/me - update own profile
router.patch("/me", verifyToken, async (req, res) => {
    try {
        const {
            bio,
            linkedinUrl,
            githubUrl,
            instagramUrl,
            customWebsiteUrl,
            qualifications,
        } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                bio,
                linkedinUrl,
                githubUrl,
                instagramUrl,
                customWebsiteUrl,
                qualifications: Array.isArray(qualifications)
                    ? qualifications
                    : undefined,
            },
            select: {
                id: true,
                name: true,
                bio: true,
                linkedinUrl: true,
                githubUrl: true,
                instagramUrl: true,
                customWebsiteUrl: true,
                qualifications: true,
            },
        });

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile." });
    }
});

// POST /api/users/:id/follow - toggle follow/unfollow
router.post("/:id/follow", verifyToken, async (req, res) => {
    try {
        const { id: followingId } = req.params;
        const followerId = req.user.userId;

        if (followerId === followingId) {
            return res
                .status(400)
                .json({ error: "You can't follow yourself." });
        }

        const existing = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });

        if (existing) {
            await prisma.follow.delete({ where: { id: existing.id } });
            return res.status(200).json({ following: false });
        }
        await prisma.follow.create({ data: { followerId, followingId } });
        res.status(200).json({ following: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update follow status." });
    }
});

export default router;
