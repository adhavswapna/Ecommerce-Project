import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
} from "../controllers/product-controller";

const router = Router();

/**
 * USER / PUBLIC
 */
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

/**
 * VENDOR
 */
router.post("/vendor/products", createProduct);

export default router;
