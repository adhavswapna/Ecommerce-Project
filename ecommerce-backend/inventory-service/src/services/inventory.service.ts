import prisma from "../db/prisma/prisma";
import { CreateInventoryDTO } from "../dtos/inventory.dto";

// ➤ Create Inventory
export const createInventory = async (data: CreateInventoryDTO) => {
  return prisma.inventory.create({
    data: {
      productId: data.productId,
      quantity: data.quantity,
    },
  });
};

// ➤ Get Inventory
export const getByProductId = async (productId: string) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  return inventory;
};

// ➤ Update Stock (Admin)
export const updateStock = async (
  productId: string,
  quantity: number
) => {
  return prisma.inventory.update({
    where: { productId },
    data: { quantity },
  });
};

// ➤ Reduce Stock (Order flow)
export const reduceStock = async (
  productId: string,
  quantity: number
) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  if (inventory.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  return prisma.inventory.update({
    where: { productId },
    data: {
      quantity: inventory.quantity - quantity,
    },
  });
};
