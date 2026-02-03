import express from "express";
import shippingRoutes from "./routes/shipping.routes";

export const app = express();

app.use(express.json());
app.use("/shipping", shippingRoutes);
