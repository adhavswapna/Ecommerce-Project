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
    const products =
      await listProducts();

    return res.status(200).json(
      products
    );

  } catch (error) {
    console.error(
      "getAllProducts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
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
    /**
     * userId comes from JWT.
     */

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User ID missing from token",
      });
    }

    console.log(
      "🔐 Vendor products requested by userId:",
      userId
    );

    /**
     * Product service:
     *
     * userId
     *   ↓
     * Vendor Service
     *   ↓
     * vendor.id
     *   ↓
     * Product.vendorId
     */

    const products =
      await listVendorProducts(
        userId
      );

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error: any) {
    console.error(
      "❌ getVendorProducts error:",
      error
    );

    /**
     * Vendor not found / not approved.
     */

    if (
      error.message?.includes(
        "Approved active vendor"
      ) ||
      error.message?.includes(
        "Vendor profile not found"
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch vendor products",
    });
  }
}


/* =====================================================
   GET PRODUCT BY ID
===================================================== */

export async function getProduct(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    const product =
      await getProductById(id);

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error: any) {
    console.error(
      "getProduct error:",
      error
    );

    if (
      error.message ===
      "Product not found"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch product",
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
    /**
     * Get authenticated userId.
     */

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User ID missing from token",
      });
    }

    /**
     * Get fields from frontend.
     */

    const {
      name,
      price,
      description,
      stock,
      priceRange,
      images,
    } = req.body;

    /**
     * Validate name.
     */

    if (
      !name ||
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required",
      });
    }

    /**
     * Validate price.
     */

    if (
      price === undefined ||
      price === null ||
      Number.isNaN(Number(price))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid price is required",
      });
    }

    /**
     * Validate stock.
     */

    if (
      stock === undefined ||
      stock === null ||
      Number.isNaN(Number(stock))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid stock is required",
      });
    }

    /**
     * Build product data.
     *
     * vendorId is intentionally NOT taken
     * from frontend.
     */

    const productData: any = {
      name: name.trim(),
      price: Number(price),
      description:
        description ?? null,
      stock: Number(stock),
    };

    /**
     * Add priceRange only if supplied.
     */

    if (
      priceRange !== undefined
    ) {
      productData.priceRange =
        priceRange;
    }

    /**
     * Images.
     *
     * Keep this only if your Prisma
     * Product model supports images
     * through nested writes.
     *
     * If images are handled by your
     * upload controller separately,
     * frontend can omit this field.
     */

    if (
      Array.isArray(images)
    ) {
      productData.images = {
        create: images.map(
          (image: any) => ({
            url:
              typeof image === "string"
                ? image
                : image.url,
            altText:
              typeof image === "string"
                ? null
                : image.altText ?? null,
          })
        ),
      };
    }

    console.log(
      "🔐 Creating product for userId:",
      userId
    );

    /**
     * Service determines vendor from
     * authenticated userId.
     */

    const product =
      await createProduct(
        productData,
        userId
      );

    console.log(
      "✅ Product created:",
      product.id,
      "vendorId:",
      product.vendorId
    );

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      data: product,
    });

  } catch (error: any) {
    console.error(
      "❌ addProduct error:",
      error
    );

    if (
      error.message?.includes(
        "Approved active vendor"
      ) ||
      error.message?.includes(
        "Vendor profile not found"
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product",
    });
  }
}


/* =====================================================
   UPDATE PRODUCT
===================================================== */

export async function editProduct(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { id } =
      req.params;

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User ID missing from token",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    const {
      name,
      price,
      description,
      stock,
      priceRange,
    } = req.body;

    /**
     * Build safe update data.
     *
     * vendorId is deliberately excluded.
     */

    const updateData: any = {};

    if (
      name !== undefined
    ) {
      updateData.name =
        name;
    }

    if (
      price !== undefined
    ) {
      const numericPrice =
        Number(price);

      if (
        Number.isNaN(
          numericPrice
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid price",
        });
      }

      updateData.price =
        numericPrice;
    }

    if (
      description !== undefined
    ) {
      updateData.description =
        description;
    }

    if (
      stock !== undefined
    ) {
      const numericStock =
        Number(stock);

      if (
        Number.isNaN(
          numericStock
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid stock",
        });
      }

      updateData.stock =
        numericStock;
    }

    if (
      priceRange !== undefined
    ) {
      updateData.priceRange =
        priceRange;
    }

    /**
     * IMPORTANT:
     *
     * Do not accept vendorId from
     * frontend.
     */

    delete updateData.vendorId;

    console.log(
      "🔐 Updating product:",
      {
        productId: id,
        userId,
      }
    );

    /**
     * Service checks ownership.
     */

    const updated =
      await updateProduct(
        id,
        updateData,
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      data: updated,
    });

  } catch (error: any) {
    console.error(
      "❌ editProduct error:",
      error
    );

    if (
      error.message ===
      "Product not found"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    if (
      error.message?.includes(
        "not authorized"
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
    });
  }
}


/* =====================================================
   DELETE PRODUCT
===================================================== */

export async function removeProduct(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { id } =
      req.params;

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User ID missing from token",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    console.log(
      "🔐 Deleting product:",
      {
        productId: id,
        userId,
      }
    );

    /**
     * Service checks ownership.
     */

    const deleted =
      await deleteProduct(
        id,
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
      data: deleted,
    });

  } catch (error: any) {
    console.error(
      "❌ removeProduct error:",
      error
    );

    if (
      error.message ===
      "Product not found"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    if (
      error.message?.includes(
        "not authorized"
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete product",
    });
  }
}


/* =====================================================
   CHECK STOCK
===================================================== */

export async function getStock(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    const stock =
      await checkStock(id);

    return res.status(200).json({
      success: true,
      productId: id,
      stock,
    });

  } catch (error: any) {
    console.error(
      "getStock error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to check stock",
    });
  }
}
