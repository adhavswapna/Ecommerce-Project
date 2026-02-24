import express from "express";
import cors from "cors";
import { ratingRouter } from "./routes/rating.routes";

const app = express();

// Allow frontend access
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "Rating service is running" });
});

// Rating routes
app.use("/ratings", ratingRouter);

export default app;

