import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: "asc" },
        });
        res.status(200).json({ subjects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch subjects." });
    }
});

export default router;
