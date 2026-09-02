import express from "express";
import fs from "fs";
import { prisma } from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../cloudinary.js";

const router = express.Router();

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
