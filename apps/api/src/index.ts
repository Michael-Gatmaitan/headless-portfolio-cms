import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.route";
import skillRoutes from "./routes/skill.route";
import awardRoutes from "./routes/award.route";
import apiKeyRoutes from "./routes/apiKey.routes";
import publicRoutes from "./routes/public.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(express.json());

const cmsCors = cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

const publicCors = cors({
  origin: "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "X-API-Key"],
});

// 60 requests per minute per IP to prevent abuse
const publicRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

app.use("/api/auth", cmsCors, authRoutes);
app.use("/api/projects", cmsCors, projectRoutes);
app.use("/api/skills", cmsCors, skillRoutes);
app.use("/api/awards", cmsCors, awardRoutes);
app.use("/api/api-keys", cmsCors, apiKeyRoutes);
app.use("/api/dashboard", cmsCors, dashboardRoutes);

app.use("/public/v1", publicCors, publicRateLimit, publicRoutes);

app.get("/health-check", async (_, res) => {
  res.status(200).json({ message: "API is running successfully" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}

export default app;
