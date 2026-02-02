import express from "express";
import adminRoutes from "./routes/admin.routes";

const app = express();
app.use(express.json());

// Mount routes under /admin
app.use("/admin", adminRoutes);

const PORT = process.env.SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Admin service running on port ${PORT}`);
});

