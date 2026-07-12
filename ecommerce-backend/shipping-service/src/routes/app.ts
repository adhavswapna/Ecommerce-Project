import express from "express";
import shippingRoutes from "./routes/shipping.routes";

export const app = express();

app.use(express.json());


// ==========================
// HEALTH CHECK
// ==========================
app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "UP",
    service: "Shipping Service",
  });
});


// ==========================
// ROUTES
// ==========================
app.use("/shipping", shippingRoutes);


// ==========================
// 404
// ==========================
app.use((_req, res) => {
  return res.status(404).json({
    message: "Shipping route not found",
  });
});
