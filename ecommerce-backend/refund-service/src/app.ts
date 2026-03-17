import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import refundRoutes from "./routes/refund.routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: "Refund Service" });
});

app.use("/refunds", refundRoutes);

export default app;
