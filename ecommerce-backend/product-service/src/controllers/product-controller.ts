import { Request, Response } from "express";
import { createProduct } from "../services/product-service";

export async function addProduct(req: Request, res: Response) {
  try {
    const { name, price, stock, vendorId } = req.body;
    const product = await createProduct(name, price, stock, vendorId);
    res.json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
