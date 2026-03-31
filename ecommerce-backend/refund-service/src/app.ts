import express from "express";
import refundRoutes from "./routes/refund.routes";

const app = express();

app.use(express.json());

app.use("/refunds", refundRoutes);

export default app;
