import { Router } from "express";
import { createProduct, getProducts } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/products", authMiddleware, createProduct);
router.get("/products", getProducts);

export default router;
