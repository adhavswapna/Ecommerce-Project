import { Router } from "express";

import {
  getAllProducts,
  getVendorProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  getStock,
} from "../controllers/product.controller";

import {
  authMiddleware,
} from "../middlewares/auth.middleware";

const router = Router();

/* =========================================
   HEALTH CHECK

   MUST BE BEFORE /:id
========================================= */

router.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      status:
        "product-service running",
    });
  }
);

/* =========================================
   VENDOR PRODUCTS

   MUST BE BEFORE /:id

   GET /products/vendor
========================================= */

router.get(
  "/vendor",
  authMiddleware,
  getVendorProducts
);

/* =========================================
   PRODUCT ROUTES
========================================= */

// Get all products
router.get(
  "/",
  getAllProducts
);

// Create product
router.post(
  "/",
  authMiddleware,
  addProduct
);

// Update product
router.put(
  "/:id",
  authMiddleware,
  editProduct
);

// Delete product
router.delete(
  "/:id",
  authMiddleware,
  removeProduct
);

// Check stock
router.get(
  "/:id/stock",
  getStock
);

// Get product by ID
// KEEP THIS LAST
router.get(
  "/:id",
  getProduct
);

export default router;
