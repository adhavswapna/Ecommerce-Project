import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  getStock,
} from "../controllers/product.controller";

const router = Router();

/* =========================================
   PRODUCT ROUTES
========================================= */

// Get all products
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProduct);

// Create product
router.post("/", addProduct);

// Update product
router.put("/:id", editProduct);

// Delete product
router.delete("/:id", removeProduct);

// Check stock
router.get("/:id/stock", getStock);

export default router;
