import express from "express";
import cors from "cors";

import productRoutes from "./routes/product.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "product-service running",
  });
});

app.use("/products", productRoutes);

export default app;
