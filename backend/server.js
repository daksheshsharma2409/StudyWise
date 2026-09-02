import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import resourceRoutes from "./routes/resources.js";
import subjectRoutes from "./routes/subjects.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/resources", resourceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://study-wise-lake.vercel.app/",
        ],
        credentials: true,
    }),
);

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
