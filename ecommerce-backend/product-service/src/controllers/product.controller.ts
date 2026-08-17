import { Request, Response } from "express";

import {
  listProducts,
  listVendorProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  checkStock,
} from "../services/product.service";

import {
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";

/* =====================================================
   GET ALL PRODUCTS
===================================================== */

export async function getAllProducts(
  _req: Request,
  res: Response
) {
  try {
    const products = await listProducts();

    return res.status(200).json(products);
  } catch (error) {
    console.error(
      "getAllProducts error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

/* =====================================================
   GET CURRENT VENDOR PRODUCTS
===================================================== */

export async function getVendorProducts(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from token",
      });
    }

    const products =
      await listVendorProducts(userId);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error(
      "getVendorProducts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor products",
      error: error.message,
    });
  }
}

/* =====================================================
   GET PRODUCT
===================================================== */

export async function getProduct(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const product =
      await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(
      "getProduct error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}

/* =====================================================
   CREATE PRODUCT
===================================================== */

export async function addProduct(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const {
      name,
      price,
      description,
      stock,
      vendorId,
      images,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined ||
      !vendorId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "name, price, stock and vendorId are required",
      });
    }

    const product =
      await createProduct(
        name,
        Number(price),
        description ?? null,
        Number(stock),
        vendorId,
        images || []
      );

    return res.status(201).json(product);
  } catch (error) {
    console.error(
      "addProduct error:",
      error
    );

    return res.status(400).json({
      message: "Failed to create product",
    });
  }
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */

export async function editProduct(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      description,
      stock,
      images,
    } = req.body;

    const updated =
      await updateProduct(id, {
        name,
        price:
          price !== undefined
            ? Number(price)
            : undefined,
        description,
        stock:
          stock !== undefined
            ? Number(stock)
            : undefined,
        images,
      });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(
      "editProduct error:",
      error
    );

    return res.status(400).json({
      message: "Failed to update product",
    });
  }
}

/* =====================================================
   DELETE PRODUCT
===================================================== */

export async function removeProduct(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const deleted =
      await deleteProduct(id);

    return res.status(200).json({
      message: "Product deleted successfully",
      product: deleted,
    });
  } catch (error) {
    console.error(
      "removeProduct error:",
      error
    );

    return res.status(400).json({
      message: "Failed to delete product",
    });
  }
}

/* =====================================================
   STOCK
===================================================== */

export async function getStock(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const stock =
      await checkStock(id);

    return res.status(200).json({
      stock,
    });
  } catch (error) {
    console.error(
      "getStock error:",
      error
    );

    return res.status(500).json({
      message: "Failed to check stock",
    });
  }
}
