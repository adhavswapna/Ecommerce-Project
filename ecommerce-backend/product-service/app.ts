import express from "express";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(express.json());


// health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "product-service running",
  });
});


app.use("/products", productRoutes);


export default app;
