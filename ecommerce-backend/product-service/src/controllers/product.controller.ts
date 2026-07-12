import { Request, Response } from "express";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  checkStock,
} from "../services/product.service";

/* GET ALL PRODUCTS */
export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await listProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("getAllProducts error:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

/* GET PRODUCT */
export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("getProduct error:", error);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}

/* CREATE PRODUCT */
export async function addProduct(req: Request, res: Response) {
  try {
    const {
      name,
      price,
      description,
      stock,
      vendorId,
      images, // NEW
    } = req.body;

    const product = await createProduct(
      name,
      Number(price),
      description ?? null,
      Number(stock),
      vendorId,
      images || []
    );

    return res.status(201).json(product);
  } catch (error) {
    console.error("addProduct error:", error);
    return res.status(400).json({ message: "Failed to create product" });
  }
}

/* UPDATE PRODUCT */
export async function editProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;

    const updated = await updateProduct(id, {
      name,
      price: price ? Number(price) : undefined,
      description,
      stock: stock ? Number(stock) : undefined,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("editProduct error:", error);
    return res.status(400).json({ message: "Failed to update product" });
  }
}

/* DELETE PRODUCT */
export async function removeProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deleted = await deleteProduct(id);

    return res.status(200).json({
      message: "Product deleted successfully",
      product: deleted,
    });
  } catch (error) {
    console.error("removeProduct error:", error);
    return res.status(400).json({ message: "Failed to delete product" });
  }
}

/* STOCK */
export async function getStock(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const stock = await checkStock(id);

    return res.status(200).json({ stock });
  } catch (error) {
    console.error("getStock error:", error);
    return res.status(500).json({ message: "Failed to check stock" });
  }
}
