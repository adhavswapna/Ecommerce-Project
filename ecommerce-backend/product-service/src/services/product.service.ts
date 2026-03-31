import { prisma } from "../db/prisma/prisma";
import { redis } from "../redis/redis-client";
import {
  publishProductCreated,
  publishProductUpdated,
  publishProductDeleted,
} from "../kafka/product-producer";

const PRODUCT_CACHE_KEY = "products:all";

/**
 * List all products
 */
export async function listProducts() {
  try {
    const cached = await redis.get(PRODUCT_CACHE_KEY);

    if (cached) {
      console.log("⚡ Products fetched from Redis cache");
      return JSON.parse(cached);
    }

    const products = await prisma.product.findMany();

    await redis.set(PRODUCT_CACHE_KEY, JSON.stringify(products), "EX", 60);

    return products;
  } catch (error) {
    console.error("Error listing products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Check stock
 */
export async function checkStock(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product?.stock ?? 0;
  } catch (error) {
    console.error("Error checking stock:", error);
    throw new Error("Failed to check stock");
  }
}

/**
 * CREATE PRODUCT (IMAGE REMOVED ✅)
 */
export async function createProduct(
  name: string,
  price: number,
  description: string | null,
  stock: number,
  vendorId: string
) {
  try {
    if (!vendorId) throw new Error("Vendor ID is required");
    if (!name || !price || stock < 0) throw new Error("Invalid product data");

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        stock,
        vendorId,
      },
    });

    await redis.del(PRODUCT_CACHE_KEY);

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
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

/**
 * UPDATE PRODUCT (NO IMAGES)
 */
export async function updateProduct(
  id: string,
  data: {
    name?: string;
    price?: number;
    description?: string;
    stock?: number;
  }
) {
  try {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) throw new Error("Product not found");

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    await redis.del(PRODUCT_CACHE_KEY);

    await publishProductUpdated({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      updatedAt: product.updatedAt,
    });

    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(id: string) {
  try {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) throw new Error("Product not found");

    const product = await prisma.product.delete({ where: { id } });

    await redis.del(PRODUCT_CACHE_KEY);

    await publishProductDeleted({
      productId: product.id,
      deletedAt: new Date().toISOString(),
    });

    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}
