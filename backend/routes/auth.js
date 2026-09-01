import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: "Name, email, and password are required." });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Email is already registered." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, passwordHash },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required." });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res
                .status(401)
                .json({ error: "Invalid email or password." });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res
                .status(401)
                .json({ error: "Invalid email or password." });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out." });
});

export default router;
