import { prisma } from "../db/prisma/prisma";
import { redis } from "../redis/redis-client";

import {
  publishProductCreated,
  publishProductUpdated,
  publishProductDeleted,
} from "../kafka/product.producer";

const PRODUCT_CACHE_KEY = "products:all";

// Vendor service through API Gateway
const VENDOR_SERVICE_URL =
  process.env.VENDOR_SERVICE_URL ||
  "http://localhost:8081/api/vendors";

/**
 * =====================================================
 * LIST ALL PRODUCTS
 * =====================================================
 */

export async function listProducts() {
  try {
    const cached =
      await redis.get(PRODUCT_CACHE_KEY);

    if (cached) {
      console.log(
        "⚡ Products fetched from Redis"
      );

      return JSON.parse(cached);
    }

    const products =
      await prisma.product.findMany({
        include: {
          images: true,
        },
      });

    await redis.set(
      PRODUCT_CACHE_KEY,
      JSON.stringify(products),
      "EX",
      60
    );

    return products;
  } catch (error) {
    console.error(
      "Error listing products:",
      error
    );

    throw new Error(
      "Failed to fetch products"
    );
  }
}

/**
 * =====================================================
 * LIST PRODUCTS FOR CURRENT VENDOR
 * =====================================================
 *
 * JWT gives us:
 *
 * userId
 *
 * Then:
 *
 * userId
 *   ↓
 * Vendor Service
 *   ↓
 * vendorId
 *   ↓
 * Product Service
 *   ↓
 * products WHERE vendorId = vendor.id
 *
 */

export async function listVendorProducts(
  userId: string
) {
  try {
    console.log(
      "🔎 Finding vendor for userId:",
      userId
    );

    const response = await fetch(
      `${VENDOR_SERVICE_URL}/user/${encodeURIComponent(
        userId
      )}`
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

    const vendorResponse =
      await response.json();

    const vendor =
      vendorResponse.data;

    if (!vendor) {
      throw new Error(
        "Vendor profile not found"
      );
    }

    console.log(
      "✅ Vendor found:",
      vendor.id
    );

    const products =
      await prisma.product.findMany({
        where: {
          vendorId: vendor.id,
        },

        include: {
          images: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      `✅ Found ${products.length} products for vendor ${vendor.id}`
    );

    return products;
  } catch (error) {
    console.error(
      "Error listing vendor products:",
      error
    );

    throw error;
  }
}

/**
 * =====================================================
 * GET PRODUCT BY ID
 * =====================================================
 */

export async function getProductById(
  id: string
) {
  try {
    return await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching product:",
      error
    );

    return null;
  }
}

/**
 * =====================================================
 * CHECK STOCK
 * =====================================================
 */

export async function checkStock(
  id: string
) {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    return product?.stock ?? 0;
  } catch (error) {
    console.error(
      "Error checking stock:",
      error
    );

    throw new Error(
      "Failed to check stock"
    );
  }
}

/**
 * =====================================================
 * CREATE PRODUCT
 * =====================================================
 */

export async function createProduct(
  name: string,
  price: number,
  description: string | null,
  stock: number,
  vendorId: string,
  images: string[] = []
) {
  try {
    const product =
      await prisma.product.create({
        data: {
          name,
          price,
          description,
          stock,
          vendorId,

          images: {
            create: images.map((url) => ({
              url: normalizeImageUrl(url),
            })),
          },
        },

        include: {
          images: true,
        },
      });

    await redis.del(
      PRODUCT_CACHE_KEY
    );

    await publishProductCreated({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      vendorId: product.vendorId,
      stock: product.stock,
      createdAt: product.createdAt,
    });

    return product;
  } catch (error) {
    console.error(
      "Error creating product:",
      error
    );

    throw new Error(
      "Failed to create product"
    );
  }
}

/**
 * =====================================================
 * UPDATE PRODUCT
 * =====================================================
 */

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    price?: number;
    description?: string;
    stock?: number;
    images?: string[];
  }
) {
  try {
    const existing =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new Error(
        "Product not found"
      );
    }

    const {
      images,
      ...productData
    } = data;

    const product =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          ...productData,

          ...(images && {
            images: {
              deleteMany: {},

              create: images.map(
                (url) => ({
                  url: normalizeImageUrl(
                    url
                  ),
                })
              ),
            },
          }),
        },

        include: {
          images: true,
        },
      });

    await redis.del(
      PRODUCT_CACHE_KEY
    );

    await publishProductUpdated({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      updatedAt: product.updatedAt,
    });

    return product;
  } catch (error) {
    console.error(
      "Error updating product:",
      error
    );

    throw new Error(
      "Failed to update product"
    );
  }
}

/**
 * =====================================================
 * DELETE PRODUCT
 * =====================================================
 */

export async function deleteProduct(
  id: string
) {
  try {
    const existing =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new Error(
        "Product not found"
      );
    }

    const product =
      await prisma.product.delete({
        where: {
          id,
        },
      });

    await redis.del(
      PRODUCT_CACHE_KEY
    );

    await publishProductDeleted({
      productId: product.id,
      deletedAt:
        new Date().toISOString(),
    });

    return product;
  } catch (error) {
    console.error(
      "Error deleting product:",
      error
    );

    throw new Error(
      "Failed to delete product"
    );
  }
}

/**
 * =====================================================
 * IMAGE NORMALIZER
 * =====================================================
 */

function normalizeImageUrl(
  url: string
): string {
  if (!url) {
    return url;
  }

  return url
    .replace(
      /\/products\/products\//g,
      "/products/"
    )
    .replace(
      /([^:]\/)\/+/g,
      "$1"
    );
}
