import { PrismaClient } from "@prisma/client";
import axios from "axios";

import {
  publishCartItemAdded,
  publishCartItemRemoved,
  publishCartCleared,
} from "../kafka/cart.producer";

import { setCart, getCart, deleteCart } from "../redis/cart.cache";

const prisma = new PrismaClient();

/* ======================================================
   FETCH PRODUCT FROM PRODUCT SERVICE
====================================================== */
async function fetchProduct(productId: string) {
  try {
    const response = await axios.get(
      `http://localhost:3003/products/${productId}`
    );

    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    throw new Error("Product not found");
  }
}

/* ======================================================
   ADD ITEM TO CART OR WISHLIST (FIXED 🔥)
====================================================== */
export async function addItem(
  userId: string,
  productId: string,
  quantity: number,
  type: "CART" | "WISHLIST" = "CART"
) {
  try {
    if (!productId || quantity <= 0) {
      throw new Error("Invalid product or quantity");
    }

    // ✅ Fetch product from product-service
    const product = await fetchProduct(productId);

    const price = product.price;

    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        type,
      },
    });

    let item;

    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price, // ✅ from product-service
          type,
        },
      });
    }

    /* invalidate cache */
    await deleteCart(userId);

    /* kafka event */
    if (type === "CART") {
      await publishCartItemAdded({
        userId,
        productId,
        quantity,
        price,
      });
    }

    console.log(`🛒 ${type} item added:`, item.id);

    return item;
  } catch (error) {
    console.error("❌ addItem error:", error);
    throw error;
  }
}

/* ======================================================
   GET USER CART OR WISHLIST
====================================================== */
export async function getUserItems(
  userId: string,
  type: "CART" | "WISHLIST" = "CART"
) {
  try {
    const cachedItems = await getCart(userId);

    if (cachedItems && type === "CART") {
      console.log("⚡ Cart served from Redis");
      return cachedItems;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          where: { type },
        },
      },
    });

    const items = cart?.items || [];

    if (type === "CART") {
      await setCart(userId, items);
    }

    return items;
  } catch (error) {
    console.error("❌ getUserItems error:", error);
    throw error;
  }
}

/* ======================================================
   UPDATE ITEM QUANTITY
====================================================== */
export async function updateItemQuantity(
  itemId: string,
  quantity: number
) {
  try {
    if (quantity <= 0) throw new Error("Quantity must be greater than 0");

    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { cart: true },
    });

    await deleteCart(item.cart.userId);

    console.log("✏️ Item quantity updated:", itemId);

    return item;
  } catch (error) {
    console.error("❌ updateItemQuantity error:", error);
    throw error;
  }
}

/* ======================================================
   REMOVE ITEM FROM CART OR WISHLIST
====================================================== */
export async function removeItem(itemId: string) {
  try {
    const item = await prisma.cartItem.delete({
      where: { id: itemId },
      include: { cart: true },
    });

    await deleteCart(item.cart.userId);

    if (item.type === "CART") {
      await publishCartItemRemoved({
        userId: item.cart.userId,
        productId: item.productId,
      });
    }

    console.log(`🗑 ${item.type} item removed:`, itemId);

    return item;
  } catch (error) {
    console.error("❌ removeItem error:", error);
    throw error;
  }
}

/* ======================================================
   CLEAR USER CART OR WISHLIST
====================================================== */
export async function clearUserItems(
  userId: string,
  type: "CART" | "WISHLIST" = "CART"
) {
  try {
    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) return;

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, type },
    });

    await deleteCart(userId);

    if (type === "CART") {
      await publishCartCleared({ userId });
    }

    console.log(`🧹 ${type} cleared for user:`, userId);
  } catch (error) {
    console.error("❌ clearUserItems error:", error);
    throw error;
  }
}

/* ======================================================
   MOVE ITEM FROM WISHLIST TO CART
====================================================== */
export async function moveWishlistToCart(itemId: string) {
  try {
    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: { type: "CART" },
      include: { cart: true },
    });

    await deleteCart(item.cart.userId);

    await publishCartItemAdded({
      userId: item.cart.userId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    });

    console.log("📦 Wishlist item moved to cart:", itemId);

    return item;
  } catch (error) {
    console.error("❌ moveWishlistToCart error:", error);
    throw error;
  }
}
