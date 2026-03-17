import { PrismaClient } from "@prisma/client";

import {
  publishCartItemAdded,
  publishCartItemRemoved,
  publishCartCleared,
} from "../kafka/cart.producer";

import { setCart, getCart, deleteCart } from "../redis/cart.cache";

const prisma = new PrismaClient();

/* ======================================================
   ADD ITEM TO CART
====================================================== */

export async function addToCart(
  userId: string,
  productId: string,
  price: number,
  quantity: number
) {
  try {
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    /* check if item already exists */

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    let item;

    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price,
        },
      });
    }

    /* invalidate cache */

    await deleteCart(userId);

    /* kafka event */

    await publishCartItemAdded({
      userId,
      productId,
      quantity,
      price,
    });

    console.log("🛒 Cart item added:", item.id);

    return item;
  } catch (error) {
    console.error("❌ addToCart error:", error);
    throw error;
  }
}

/* ======================================================
   GET USER CART
====================================================== */

export async function getUserCart(userId: string) {
  try {
    /* check redis first */

    const cachedCart = await getCart(userId);

    if (cachedCart) {
      console.log("⚡ Cart served from Redis");
      return cachedCart;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    const items = cart?.items || [];

    /* cache result */

    await setCart(userId, items);

    return items;
  } catch (error) {
    console.error("❌ getUserCart error:", error);
    throw error;
  }
}

/* ======================================================
   UPDATE CART ITEM
====================================================== */

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        cart: true,
      },
    });

    /* invalidate cache */

    await deleteCart(item.cart.userId);

    console.log("✏️ Cart item updated:", itemId);

    return item;
  } catch (error) {
    console.error("❌ updateCartItem error:", error);
    throw error;
  }
}

/* ======================================================
   REMOVE ITEM FROM CART
====================================================== */

export async function removeCartItem(itemId: string) {
  try {
    const item = await prisma.cartItem.delete({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    /* invalidate cache */

    await deleteCart(item.cart.userId);

    /* kafka event */

    await publishCartItemRemoved({
      userId: item.cart.userId,
      productId: item.productId,
    });

    console.log("🗑 Cart item removed:", itemId);

    return item;
  } catch (error) {
    console.error("❌ removeCartItem error:", error);
    throw error;
  }
}

/* ======================================================
   CLEAR USER CART
====================================================== */

export async function clearUserCart(userId: string) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) return;

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    /* invalidate cache */

    await deleteCart(userId);

    /* kafka event */

    await publishCartCleared({
      userId,
    });

    console.log("🧹 Cart cleared for user:", userId);
  } catch (error) {
    console.error("❌ clearUserCart error:", error);
    throw error;
  }
}
