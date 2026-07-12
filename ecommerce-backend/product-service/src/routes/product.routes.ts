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
   HEALTH CHECK
   MUST BE BEFORE /:id
========================================= */

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "product-service running",
  });
});


/* =========================================
   PRODUCT ROUTES
========================================= */

// Get all products
router.get("/", getAllProducts);


// Create product
router.post("/", addProduct);


// Update product
router.put("/:id", editProduct);


// Delete product
router.delete("/:id", removeProduct);


// Check stock
router.get("/:id/stock", getStock);


// Get product by ID
// KEEP THIS LAST
router.get("/:id", getProduct);


export default router;
