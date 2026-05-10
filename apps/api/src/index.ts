import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.route";
import skillRoutes from "./routes/skill.route";
import awardRoutes from "./routes/award.route";
import { db } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/awards", awardRoutes);

app.get("/health-check", async (_, res) => {
  const users = await db.query.users.findMany();
  console.log(users);
  res.status(200).json({ message: "API is running successfully" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}

export default app;
