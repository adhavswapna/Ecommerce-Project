import express from "express";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

app.use(express.json());
app.use("/analytics", analyticsRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "Analytics service running" });
});

export default app;
