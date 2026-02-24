import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Add product to user's cart
 */
export async function addToCart(
  userId: string,
  productId: string,
  price: number,
  quantity: number
) {
  let cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      price,
    },
  });

  return item;
}

/**
 * Get all items in user's cart
 */
export async function getUserCart(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  return cart?.items || [];
}

/**
 * Update quantity of a cart item
 */
export async function updateCartItem(itemId: string, quantity: number) {
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

/**
 * Remove a single item from cart
 */
export async function removeCartItem(itemId: string) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

/**
 * Clear all items from user's cart
 */
export async function clearUserCart(userId: string) {
  const cart = await prisma.cart.findFirst({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

