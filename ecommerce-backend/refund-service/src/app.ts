import express from "express";
import refundRoutes from "./routes/refund.routes";

const app = express();

app.use(express.json());


/* ================= HEALTH CHECK ================= */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP",
    service: "Refund Service",
  });
});


/* ================= ROUTES ================= */

app.use("/refunds", refundRoutes);


/* ================= 404 ================= */

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


export default app;
