import { Request, Response } from "express"; import {
  addItem,
  getUserItems,
  updateItemQuantity,
  removeItem,
  clearUserItems,
  moveWishlistToCart,
  moveCartToWishlist,
} from "../services/cart.service";

/* ======================================================
   ADD TO CART
====================================================== */
export async function addItemController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity, price } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const item = await addItem(userId, productId, quantity, price);

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
   CLEAR CART
====================================================== */
export async function clearItems(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    await clearUserItems(userId, "CART");

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   CLEAR WISHLIST
====================================================== */
export async function clearWishlist(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    await clearUserItems(userId, "WISHLIST");

    res.json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ======================================================
   MOVE CART → WISHLIST
====================================================== */
export async function moveItemToWishlist(req: Request, res: Response) {
  try {
    const { itemId } = req.params;

    const item = await moveCartToWishlist(itemId);

    res.json(item);
  } catch (error) {
    console.error("Error moving to wishlist:", error);
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
    console.error("Error moving to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
