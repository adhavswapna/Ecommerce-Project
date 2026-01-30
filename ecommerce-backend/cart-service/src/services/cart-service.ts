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
  try {
    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Create cart item
    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price,
      },
    });

    return item;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

/**
 * Get all items in user's cart
 */
export async function getUserCart(userId: string) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: true,
      },
    });

    return cart?.items || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

