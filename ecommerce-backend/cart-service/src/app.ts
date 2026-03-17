import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/cart.routes";

const app = express();

/* ---------------- GLOBAL MIDDLEWARES ---------------- */

app.use(
  cors({
    origin: [
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- HEALTH CHECK ---------------- */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "cart-service running",
  });
});

/* ---------------- ROUTES ---------------- */

app.use("/cart", routes);

/* ---------------- 404 ---------------- */

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("❌ Cart Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;

