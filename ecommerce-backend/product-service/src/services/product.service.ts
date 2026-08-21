import { prisma } from "../db/prisma/prisma";

/**
 * =========================================================
 * VENDOR SERVICE URL
 * =========================================================
 */

const VENDOR_SERVICE_URL =
  process.env.VENDOR_SERVICE_URL ||
  "http://localhost:3012/vendors";

/**
 * =========================================================
 * GET APPROVED + ACTIVE VENDOR FOR CURRENT USER
 * =========================================================
 */

async function getCurrentVendor(userId: string) {
  try {
    console.log(
      "🔎 Finding vendor for userId:",
      userId
    );

    if (!userId || userId.trim() === "") {
      throw new Error(
        "User ID is required"
      );
    }

    const url =
      `${VENDOR_SERVICE_URL}/user/${encodeURIComponent(
        userId
      )}`;

    console.log(
      "➡️ Calling Vendor Service:",
      url
    );

    const response = await fetch(url);

    console.log(
      "➡️ Vendor Service status:",
      response.status
    );

    const responseText =
      await response.text();

    console.log(
      "➡️ Vendor Service raw response:",
      responseText
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Vendor profile not found for this user"
        );
      }

      throw new Error(
        `Vendor service returned ${response.status}`
      );
    }

    let vendorResponse: any;

    try {
      vendorResponse =
        JSON.parse(responseText);
    } catch {
      throw new Error(
        "Vendor Service returned invalid JSON"
      );
    }

    if (
      !vendorResponse ||
      vendorResponse.success !== true
    ) {
      throw new Error(
        "Invalid Vendor Service response"
      );
    }

    const vendors =
      vendorResponse.data;

    if (!Array.isArray(vendors)) {
      throw new Error(
        "Vendor Service returned invalid vendor data"
      );
    }

    /**
     * Find ONLY approved + active vendor.
     */

    const vendor =
      vendors.find(
        (item: any) =>
          item.status === "APPROVED" &&
          item.isActive === true
      );

    if (!vendor) {
      throw new Error(
        "Approved active vendor profile not found for this user"
      );
    }

    console.log(
      "✅ Selected vendor:",
      {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        userId: vendor.userId,
        status: vendor.status,
        isActive: vendor.isActive,
      }
    );

    return vendor;

  } catch (error) {
    console.error(
      "❌ Error finding current vendor:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * LIST PRODUCTS FOR CURRENT VENDOR
 * =========================================================
 */

export async function listVendorProducts(
  userId: string
) {
  try {
    console.log(
      "=============================================="
    );

    console.log(
      "🔐 LIST VENDOR PRODUCTS"
    );

    console.log(
      "🔑 JWT userId:",
      userId
    );

    /**
     * Get approved + active vendor.
     */

    const vendor =
      await getCurrentVendor(userId);

    /**
     * Product.vendorId stores Vendor.id.
     *
     * NEVER use userId directly.
     */

    const vendorId =
      vendor.id;

    console.log(
      "🔥 Using vendorId:",
      vendorId
    );

    /**
     * Fetch ONLY products belonging
     * to this vendor.
     */

    const products =
      await prisma.product.findMany({
        where: {
          vendorId: vendorId,
        },

        include: {
          images: true,
          category: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      `✅ Found ${products.length} products for vendor ${vendorId}`
    );

    console.log(
      "🔥 Product result:"
    );

    console.log(
      products.map(
        (product) => ({
          id: product.id,
          vendorId: product.vendorId,
          name: product.name,
          categoryId: product.categoryId,
          category: product.category?.name ?? null,
        })
      )
    );

    /**
     * Extra ownership validation.
     */

    const invalidProducts =
      products.filter(
        (product) =>
          product.vendorId !== vendorId
      );

    if (
      invalidProducts.length > 0
    ) {
      console.error(
        "🚨 SECURITY ERROR: Products from another vendor detected!"
      );

      throw new Error(
        "Product ownership validation failed"
      );
    }

    console.log(
      "=============================================="
    );

    return products;

  } catch (error) {
    console.error(
      "❌ Error listing vendor products:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * CREATE PRODUCT
 * =========================================================
 */

export async function createProduct(
  data: any,
  userId: string
) {
  try {
    /**
     * Get approved + active vendor.
     */

    const vendor =
      await getCurrentVendor(userId);

    /**
     * NEVER trust vendorId from frontend.
     */

    const {
      vendorId: _ignoredVendorId,
      ...safeData
    } = data;

    /**
     * Create product using the vendor
     * determined from authenticated user.
     */

    const product =
      await prisma.product.create({
        data: {
          ...safeData,
          vendorId: vendor.id,
        },

        include: {
          images: true,
          category: true,
        },
      });

    console.log(
      "✅ Product created:",
      {
        id: product.id,
        vendorId: product.vendorId,
        categoryId: product.categoryId,
      }
    );

    return product;

  } catch (error) {
    console.error(
      "❌ Error creating product:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * GET PRODUCT BY ID
 * =========================================================
 */

export async function getProductById(
  productId: string
) {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        include: {
          images: true,
          category: true,
        },
      });

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    return product;

  } catch (error) {
    console.error(
      "❌ Error getting product:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * UPDATE PRODUCT
 * =========================================================
 */

export async function updateProduct(
  productId: string,
  data: any,
  userId: string
) {
  try {
    /**
     * Get current approved + active vendor.
     */

    const vendor =
      await getCurrentVendor(userId);

    /**
     * Find existing product.
     */

    const existing =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existing) {
      throw new Error(
        "Product not found"
      );
    }

    /**
     * Verify ownership.
     */

    if (
      existing.vendorId !== vendor.id
    ) {
      throw new Error(
        "You are not authorized to update this product"
      );
    }

    /**
     * NEVER allow frontend to change vendorId.
     */

    const {
      vendorId: _ignoredVendorId,
      ...safeData
    } = data;

    /**
     * Update product.
     */

    const product =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
          ...safeData,
          vendorId: vendor.id,
        },

        include: {
          images: true,
          category: true,
        },
      });

    console.log(
      "✅ Product updated:",
      {
        id: product.id,
        vendorId: product.vendorId,
        categoryId: product.categoryId,
      }
    );

    return product;

  } catch (error) {
    console.error(
      "❌ Error updating product:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * DELETE PRODUCT
 * =========================================================
 */

export async function deleteProduct(
  productId: string,
  userId: string
) {
  try {
    /**
     * Get approved + active vendor.
     */

    const vendor =
      await getCurrentVendor(userId);

    /**
     * Find product.
     */

    const existing =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existing) {
      throw new Error(
        "Product not found"
      );
    }

    /**
     * Verify ownership.
     */

    if (
      existing.vendorId !== vendor.id
    ) {
      throw new Error(
        "You are not authorized to delete this product"
      );
    }

    /**
     * Delete product.
     */

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    console.log(
      "✅ Product deleted:",
      {
        productId,
        vendorId: vendor.id,
      }
    );

    return {
      success: true,
      message:
        "Product deleted successfully",
    };

  } catch (error) {
    console.error(
      "❌ Error deleting product:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * LIST ALL PRODUCTS / FILTER BY CATEGORY
 * =========================================================
 *
 * Public storefront product listing.
 *
 * GET /products
 *     ↓
 * All products
 *
 * GET /products?category=Electronics
 *     ↓
 * Only Electronics products
 *
 * GET /products?category=Fashion
 *     ↓
 * Only Fashion products
 *
 * GET /products?category=Home
 *     ↓
 * Only Home products
 *
 * GET /products?category=Beauty
 *     ↓
 * Only Beauty products
 *
 * Filtering is done through the Prisma
 * Product -> Category relation.
 */

export async function listProducts(
  category?: string
) {
  try {
    console.log(
      "=============================================="
    );

    console.log(
      "🛍️ LIST PRODUCTS"
    );

    console.log(
      "🏷️ Category filter:",
      category || "ALL"
    );

    const products =
      await prisma.product.findMany({
        where: category
          ? {
              category: {
                name: {
                  equals: category,
                  mode: "insensitive",
                },
              },
            }
          : undefined,

        include: {
          images: true,
          category: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      `✅ Found ${products.length} products`
    );

    console.log(
      products.map(
        (product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          category:
            product.category?.name ?? null,
          categorySlug:
            product.category?.slug ?? null,
        })
      )
    );

    console.log(
      "=============================================="
    );

    return products;

  } catch (error) {
    console.error(
      "❌ Error listing products:",
      error
    );

    throw error;
  }
}


/**
 * =========================================================
 * CHECK PRODUCT STOCK
 * =========================================================
 */

export async function checkStock(
  productId: string
) {
  try {
    console.log(
      "🔎 Checking stock for product:",
      productId
    );

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          id: true,
          stock: true,
        },
      });

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    console.log(
      "✅ Product stock:",
      {
        productId: product.id,
        stock: product.stock,
      }
    );

    return product.stock;

  } catch (error) {
    console.error(
      "❌ Error checking product stock:",
      error
    );

    throw error;
  }
}
