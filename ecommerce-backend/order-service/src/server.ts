import dotenv from "dotenv";
import express from "express";
import orderRoutes from "./routes/order-routes"; // make sure this exists
import bodyParser from "body-parser";

dotenv.config(); // load .env

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());

// Mount order routes with /orders prefix
app.use("/orders", orderRoutes);

// Optional: health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Start server
const port = Number(process.env.SERVICE_PORT) || 3006;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
