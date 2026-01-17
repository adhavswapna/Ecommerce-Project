import { Request, Response } from "express";
import { addToCart, getUserCart } from "../services/cart-service";

export async function addItem(req: Request, res: Response) {
  try {
    const { userId, productId, price } = req.body;

    if (!userId || !productId || price === undefined) {
      return res.status(400).json({
        message: "userId, productId and price are required",
      });
    }

    const item = await addToCart(userId, productId, Number(price));
    return res.status(201).json(item);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;
    const cart = await getUserCart(userId);
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
