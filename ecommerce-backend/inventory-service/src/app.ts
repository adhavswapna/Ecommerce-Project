import express from "express";
import inventoryRoutes from "./routes/inventory.routes";

const app = express();

app.use(express.json());

app.use("/inventory", inventoryRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "Inventory service running" });
});

export default app;
