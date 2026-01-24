import { Prisma, Product } from "@prisma/client";
import { prisma } from "../db/prisma/prisma";

/**
 * USER – list active products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      vendor: {
        select: { id: true, name: true },
      },
    },
  });
};

/**
 * USER – get single product
 */
export const getProductById = async (
  id: string
): Promise<Product | null> => {
  return prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      category: true,
      vendor: {
        select: { id: true, name: true },
      },
    },
  });
};

interface CreateProductInput {
  vendorId: string;
  name: string;
  description?: string;
  price: string;      // Decimal as string
  stock: number;
  categoryId?: string;
}

/**
 * VENDOR – create product
 */
export const createProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  return prisma.product.create({
    data: {
      vendorId: data.vendorId,
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      stock: data.stock,
      categoryId: data.categoryId,
    },
  });
};
