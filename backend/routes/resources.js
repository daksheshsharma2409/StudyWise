import express from "express";
import fs from "fs";
import { prisma } from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true } },
                subject: { select: { id: true, name: true } },
                votes: true,
            },
        });

        res.status(200).json({ resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch resources." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await prisma.resource.update({
            where: { id },
            data: { views: { increment: 1 } },
            include: {
                user: { select: { id: true, name: true } },
                subject: { select: { id: true, name: true } },
                votes: true,
            },
        });

        res.status(200).json({ resource });
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Resource not found." });
        }
        console.error(err);
        res.status(500).json({ error: "Failed to fetch resource." });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await prisma.resource.findUnique({ where: { id } });

        if (!resource) {
            return res.status(404).json({ error: "Resource not found." });
        }

        if (resource.userId !== req.user.userId) {
            return res
                .status(403)
                .json({ error: "You can only delete your own resources." });
        }

        await prisma.resource.delete({ where: { id } });

        res.status(200).json({ message: "Resource deleted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete resource." });
    }
});

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        const { title, description, subjectId } = req.body;

        if (!title || !subjectId || !req.file) {
            return res
                .status(400)
                .json({ error: "Title, subjectId, and a file are required." });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "study-resources",
        });

        fs.unlinkSync(req.file.path);

        const thumbnailUrl = cloudinary.url(result.public_id, {
            format: "jpg",
            page: 1,
            width: 400,
            height: 520,
            crop: "fill",
            resource_type: "image",
        });

        const resource = await prisma.resource.create({
            data: {
                title,
                description,
                fileUrl: result.secure_url,
                publicId: result.public_id,
                thumbnailUrl,
                userId: req.user.userId,
                subjectId,
            },
        });

        res.status(201).json({ resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed." });
    }
});

export default router;
