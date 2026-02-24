import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listProducts() {
  return prisma.product.findMany();
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function checkStock(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product?.stock ?? 0;
}

export async function createProduct(
  name: string,
  price: number,
  description: string | null,
  stock: number,
  vendorId: string
) {
  return prisma.product.create({
    data: { name, price, description, stock, vendorId },
  });
}

export async function updateProduct(
  id: string,
  data: { name?: string; price?: number; description?: string; stock?: number }
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

