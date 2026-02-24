import prisma from "../db/prisma/prisma";
import { CreateInventoryDTO } from "../dtos/inventory.dto";

export const createInventory = async (data: CreateInventoryDTO) => {
  return prisma.inventory.create({
    data: {
      productId: data.productId,
      quantity: data.quantity,
    },
  });
};

export const getByProductId = async (productId: string) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  return inventory;
};

export const updateStock = async (
  productId: string,
  quantity: number
) => {
  return prisma.inventory.update({
    where: { productId },
    data: { quantity },
  });
};
