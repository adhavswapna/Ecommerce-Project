
import express from "express";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(express.json());

// ✅ THIS LINE IS REQUIRED
app.use("/orders", orderRoutes);

// Optional health (if separate)
app.get("/health", (_req, res) => {
  res.json({
    status: "UP",
    service: "Order Service",
  });
});

export default app;
