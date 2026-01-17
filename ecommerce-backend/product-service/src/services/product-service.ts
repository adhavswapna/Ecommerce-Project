import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new product
 */
export async function createProduct(
  name: string,
  price: number,
  stock: number,
  vendorId: string
): Promise<Product> {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        vendorId,
      },
    });
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}
