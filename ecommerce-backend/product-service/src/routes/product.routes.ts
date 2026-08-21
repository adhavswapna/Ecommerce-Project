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

/**
 * GET /products
 *
 * All products
 *
 * GET /products?category=Electronics
 *
 * Products filtered by category
 */

router.get(
  "/",
  getAllProducts
);

/* =========================================
   CREATE PRODUCT
========================================= */

router.post(
  "/",
  authMiddleware,
  addProduct
);

/* =========================================
   UPDATE PRODUCT
========================================= */

router.put(
  "/:id",
  authMiddleware,
  editProduct
);

/* =========================================
   DELETE PRODUCT
========================================= */

router.delete(
  "/:id",
  authMiddleware,
  removeProduct
);

/* =========================================
   CHECK STOCK
========================================= */

router.get(
  "/:id/stock",
  getStock
);

/* =========================================
   GET PRODUCT BY ID
   KEEP THIS LAST
========================================= */

router.get(
  "/:id",
  getProduct
);

export default router;
