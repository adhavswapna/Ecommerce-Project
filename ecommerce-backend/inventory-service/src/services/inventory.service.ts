import prisma from "../db/prisma/prisma";
import { CreateInventoryDTO } from "../dtos/inventory.dto";

// ➤ Create Inventory
export const createInventory = async (data: CreateInventoryDTO) => {
  console.log("📦 Creating inventory:", data);

  return prisma.inventory.create({
    data: {
      productId: data.productId,
      quantity: data.quantity,
    },
  });
};


// ➤ Get Inventory
export const getByProductId = async (productId: string) => {

  console.log("🔎 Get inventory productId:", productId);

  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    console.log("❌ Inventory not found for:", productId);
    throw new Error("Inventory not found");
  }

  return inventory;
};


// ➤ Update Stock (Admin)
export const updateStock = async (
  productId: string,
  quantity: number
) => {

  console.log("✏️ Updating stock");
  console.log("productId:", productId);
  console.log("new quantity:", quantity);

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

  console.log("================================");
  console.log("📉 Reduce stock called");
  console.log("🔎 productId received:", productId);
  console.log("🔢 quantity received:", quantity);


  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });


  console.log("📦 Inventory found:", inventory);


  if (!inventory) {

    console.log(
      "❌ Inventory not found for product:",
      productId
    );

    throw new Error("Inventory not found");
  }


  if (inventory.quantity < quantity) {

    console.log(
      "❌ Insufficient stock",
      {
        available: inventory.quantity,
        requested: quantity
      }
    );

    throw new Error("Insufficient stock");
  }


  const updatedInventory = await prisma.inventory.update({
    where: { productId },
    data: {
      quantity: inventory.quantity - quantity,
    },
  });


  console.log(
    "✅ Stock reduced successfully:",
    updatedInventory
  );


  return updatedInventory;
};
