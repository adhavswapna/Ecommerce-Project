import express from "express";
import vendorRoutes from "./routes/vendor-routes";

const app = express();
app.use(express.json());
app.use("/vendors", vendorRoutes);

export default app;
