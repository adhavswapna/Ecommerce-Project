import { Router } from "express";
import {
  addItemController,
  addToWishlist,
  getCartItems,
  getWishlistItems,
  updateItem,
  removeItemController,
  clearItems,
  clearWishlist,
  moveItemToCart,
  moveItemToWishlist,
} from "../controllers/cart.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* ================= CART ================= */

router.post("/add", authMiddleware, addItemController);
router.get("/", authMiddleware, getCartItems);

router.put("/update/:itemId", authMiddleware, updateItem);
router.delete("/remove/:itemId", authMiddleware, removeItemController);
router.delete("/clear", authMiddleware, clearItems);

/* ================= WISHLIST ================= */

router.post("/wishlist/add", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlistItems);

router.delete("/wishlist/remove/:itemId", authMiddleware, removeItemController);
router.delete("/wishlist/clear", authMiddleware, clearWishlist);

// ✅ CART → WISHLIST
router.put("/wishlist/move/:itemId", authMiddleware, moveItemToWishlist);

// ✅ WISHLIST → CART
router.put("/cart/move/:itemId", authMiddleware, moveItemToCart);

export default router;
