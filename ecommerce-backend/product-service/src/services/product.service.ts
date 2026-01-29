import { prisma } from "../../db/prisma/prisma";

interface CreateProductInput {
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  stock: number;
  vendorId: string;
}

export const ProductService = {
  async create(data: CreateProductInput) {
    return prisma.product.create({
      data,
    });
  },

  async getAll() {
    return prisma.product.findMany();
  },
};
