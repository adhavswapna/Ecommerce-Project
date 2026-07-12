import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/cart.routes";

const app = express();

/**
 * ✅ FIXED CORS CONFIG
 * MUST match frontend (http://localhost:3000)
 * MUST NOT use "*" because withCredentials=true is used in frontend
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/* ✅ HEALTH */
app.get("/health", (_req, res) => {
  res.json({ status: "cart-service running" });
});

/* Routes */
app.use("/", routes);

/* 404 */
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
