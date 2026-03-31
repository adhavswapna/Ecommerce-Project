import { Request, Response } from "express";
import {
  addItem,
  getUserItems,
  updateItemQuantity,
  removeItem,
  clearUserItems,
  moveWishlistToCart,
} from "../services/cart.service";

/* ======================================================
   ADD TO CART
====================================================== */
export async function addItemController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const item = await addItem(userId, productId, quantity);

    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   ADD TO WISHLIST
====================================================== */
export async function addToWishlist(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity } = req.body;

    const item = await addItem(userId, productId, quantity, "WISHLIST");

    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   GET CART
====================================================== */
export async function getCartItems(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const items = await getUserItems(userId, "CART");

    res.json(items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   GET WISHLIST
====================================================== */
export async function getWishlistItems(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const items = await getUserItems(userId, "WISHLIST");

    res.json(items);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   UPDATE ITEM
====================================================== */
export async function updateItem(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await updateItemQuantity(itemId, quantity);

    res.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   REMOVE ITEM
====================================================== */
export async function removeItemController(req: Request, res: Response) {
  try {
    const { itemId } = req.params;

    const item = await removeItem(itemId);

    res.json({ message: "Item removed", item });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   CLEAR CART / WISHLIST
====================================================== */
export async function clearItems(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    await clearUserItems(userId);

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   MOVE WISHLIST → CART
====================================================== */
export async function moveItemToCart(req: Request, res: Response) {
  try {
    const { itemId } = req.params;

    const item = await moveWishlistToCart(itemId);

    res.json(item);
  } catch (error) {
    console.error("Error moving item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
