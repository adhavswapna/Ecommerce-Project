import { Request, Response } from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
} from "../services/cart.service";

export async function addItem(req: Request, res: Response) {
  try {
    const { userId, productId, price, quantity } = req.body;

    if (!userId || !productId || price === undefined) {
      return res.status(400).json({ message: "userId, productId and price are required" });
    }

    const item = await addToCart(userId, productId, Number(price), Number(quantity) || 1);
    return res.status(201).json(item);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const items = await getUserCart(userId);
    return res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateItem(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const item = await updateCartItem(itemId, Number(quantity));
    return res.json(item);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeItem(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    await removeCartItem(itemId);
    return res.json({ message: "Item removed" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await clearUserCart(userId);
    return res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

