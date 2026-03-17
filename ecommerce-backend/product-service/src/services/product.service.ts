import { prisma } from "../db/prisma/prisma";
import { redis } from "../redis/redis-client";
import {
  publishProductCreated,
  publishProductUpdated,
  publishProductDeleted,
} from "../kafka/product-producer";

const PRODUCT_CACHE_KEY = "products:all";

/**
 * List all products (with Redis cache)
 */
export async function listProducts() {
  const cached = await redis.get(PRODUCT_CACHE_KEY);

  if (cached) {
    console.log("⚡ Products fetched from Redis cache");
    return JSON.parse(cached);
  }

  const products = await prisma.product.findMany();

  await redis.set(PRODUCT_CACHE_KEY, JSON.stringify(products), "EX", 60);

  return products;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

/**
 * Check product stock
 */
export async function checkStock(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product?.stock ?? 0;
}

/**
 * Create product
 */
export async function createProduct(
  name: string,
  price: number,
  description: string | null,
  stock: number,
  vendorId: string
) {
  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      stock,
      vendorId,
    },
  });

  // invalidate cache
  await redis.del(PRODUCT_CACHE_KEY);

  // Kafka event
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
}

/**
 * Update product
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
  const product = await prisma.product.update({
    where: { id },
    data,
  });

  await redis.del(PRODUCT_CACHE_KEY);

  await publishProductUpdated({
    productId: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    updatedAt: product.updatedAt,
  });

  return product;
}

/**
 * Delete product
 */
export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({
    where: { id },
  });

  await redis.del(PRODUCT_CACHE_KEY);

  await publishProductDeleted({
    productId: product.id,
    deletedAt: new Date().toISOString(),
  });

  return product;
}
