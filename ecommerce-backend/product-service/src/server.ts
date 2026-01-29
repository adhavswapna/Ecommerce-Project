import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(productRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`🚀 Product service on ${PORT}`);
});
