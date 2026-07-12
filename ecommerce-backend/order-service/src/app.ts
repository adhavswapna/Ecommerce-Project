import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

/* ================= HEALTH CHECK (IMPORTANT - MUST BE FIRST) ================= */

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "UP",
    service: "Order Service",
  });
});

/* ================= ROUTES ================= */

app.use("/orders", orderRoutes);

/* ================= 404 HANDLER (MUST BE LAST) ================= */

app.use((_req, res) => {
  return res.status(404).json({
    message: "Order not found",
  });
});

/* ================= ERROR HANDLER ================= */

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("❌ Order Service Error:", err);

  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
