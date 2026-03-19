import express from "express";
import cors from "cors"; // ✅ ADD THIS
import orderRoutes from "./routes/order.routes";

const app = express();

// ✅ ADD THIS BLOCK (VERY IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight (important for PUT/DELETE/headers)
app.options("*", cors());

app.use(express.json());

// ✅ Routes
app.use("/orders", orderRoutes);

// ✅ Health
app.get("/health", (_req, res) => {
  res.json({
    status: "UP",
    service: "Order Service",
  });
});

export default app;
