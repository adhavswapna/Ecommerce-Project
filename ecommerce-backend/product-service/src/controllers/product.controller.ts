import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, categoryId, stock } = req.body;

  const user = (req as any).user;

  if (user.role !== "VENDOR") {
    return res.status(403).json({ message: "Only vendors can create products" });
  }

  const product = await ProductService.create({
    name,
    price,
    description,
    categoryId,
    stock,
    vendorId: user.userId,
  });

  res.status(201).json(product);
};

export const getProducts = async (_req: Request, res: Response) => {
  const products = await ProductService.getAll();
  res.json(products);
};
