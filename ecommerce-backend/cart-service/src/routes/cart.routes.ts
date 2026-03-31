import { Router } from "express";
import {
  addItemController,
  addToWishlist,
  getCartItems,
  getWishlistItems,
  updateItem,
  removeItemController,
  clearItems,
  moveItemToCart,
} from "../controllers/cart.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* ================= CART ================= */

router.post("/add", authMiddleware, addItemController);
router.get("/", authMiddleware, getCartItems);

/* ================= WISHLIST ================= */

router.post("/wishlist/add", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlistItems);
router.delete("/wishlist/remove/:itemId", authMiddleware, removeItemController);
router.put("/wishlist/move/:itemId", authMiddleware, moveItemToCart);

/* ================= COMMON ================= */

router.put("/update/:itemId", authMiddleware, updateItem);
router.delete("/remove/:itemId", authMiddleware, removeItemController);
router.delete("/clear", authMiddleware, clearItems);

export default router;
