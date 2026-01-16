import { prisma } from "../prisma/prisma";

export async function createProduct(name: string, price: number) {
  return prisma.product.create({
    data: { name, price },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany();
}
