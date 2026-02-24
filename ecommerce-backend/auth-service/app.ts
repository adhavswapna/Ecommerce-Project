import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app = express();

/* 🔴 REQUIRED */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

/* 🔴 REQUIRED */
app.use(express.json());

app.use("/auth", authRoutes);

/* health check */
app.get("/health", (_req, res) => {
  res.json({ status: "auth-service up" });
});

export default app;

