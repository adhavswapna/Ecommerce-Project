import express from "express";
import cors from "cors";

import productRoutes from "./routes/product.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "product-service running",
  });
});

// Product routes
app.use("/products", productRoutes);

// Image upload routes
app.use("/upload", uploadRoutes);

export default app;
