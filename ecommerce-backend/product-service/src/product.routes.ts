import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  getStock,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/product.controller";

const router = Router();

/* ================= PRODUCT ROUTES ================= */

// Get all products
router.get("/", getAllProducts);

// Check product stock (must come before :id route)
router.get("/stock/:id", getStock);

// Get single product
router.get("/:id", getProduct);

// Create product
router.post("/", addProduct);

// Update product
router.put("/:id", editProduct);

// Delete product
router.delete("/:id", removeProduct);

export default router;
