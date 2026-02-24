import { Request, Response } from "express";
import {
  listProducts,
  getProductById,
  checkStock,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getStock(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const stock = await checkStock(id);
    res.json({ productId: id, stock });
  } catch (error) {
    console.error("Error checking stock:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addProduct(req: Request, res: Response) {
  try {
    const { name, price, description, stock, vendorId } = req.body;
    const product = await createProduct(name, price, description, stock, vendorId);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function editProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await updateProduct(id, req.body);
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

