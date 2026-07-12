import express from "express";
import vendorRoutes from "./routes/vendor-routes";

const app = express();


// Middleware
app.use(express.json());


// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "vendor-service running",
  });
});


// Vendor Routes
app.use("/vendors", vendorRoutes);


export default app;
