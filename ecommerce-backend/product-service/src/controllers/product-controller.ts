import { Request, Response } from "express";
import * as productService from "../services/product-service";

/**
 * GET /products
 * USER – list active products
 */
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * GET /products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/**
 * POST /vendor/products
 * VENDOR – create product
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    // TEMP for testing
    // Later replace with: req.user.vendorId
    const vendorId = "test-vendor-id";

    const product = await productService.createProduct({
      vendorId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      categoryId: req.body.categoryId,
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};
