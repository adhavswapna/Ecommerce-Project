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
   CONFIG (NO HARDCODING ✅)
====================================================== */
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3004";

/* ======================================================
   FETCH PRODUCT FROM PRODUCT SERVICE
====================================================== */
async function fetchProduct(productId: string) {
  try {
    const response = await axios.get(
      `${PRODUCT_SERVICE_URL}/products/${productId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch product:", error.message);
    throw new Error("Product not found");
  }
}

/* ======================================================
   ADD ITEM
====================================================== */
export async function addItem(
  userId: string,
  productId: string,
  quantity: number,
  type: "CART" | "WISHLIST" = "CART"
) {
  if (!productId || quantity <= 0) {
    throw new Error("Invalid product or quantity");
  }

  const product = await fetchProduct(productId);
  const price = product.price;

  let cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, type },
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
        price,
        type,
      },
    });
  }

  await deleteCart(userId);

  if (type === "CART") {
    await publishCartItemAdded({
      userId,
      productId,
      quantity,
      price,
    });
  }

  return item;
}

/* ======================================================
   GET ITEMS
====================================================== */
export async function getUserItems(
  userId: string,
  type: "CART" | "WISHLIST" = "CART"
) {
  const cached = await getCart(userId);

  if (cached && type === "CART") {
    return cached;
  }

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: { where: { type } },
    },
  });

  const items = cart?.items || [];

  if (type === "CART") {
    await setCart(userId, items);
  }

  return items;
}

/* ======================================================
   UPDATE QUANTITY
====================================================== */
export async function updateItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) throw new Error("Quantity must be greater than 0");

  const item = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { cart: true },
  });

  await deleteCart(item.cart.userId);

  return item;
}

/* ======================================================
   REMOVE ITEM
====================================================== */
export async function removeItem(itemId: string) {
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

  return item;
}

/* ======================================================
   CLEAR
====================================================== */
export async function clearUserItems(
  userId: string,
  type: "CART" | "WISHLIST" = "CART"
) {
  const cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, type },
  });

  await deleteCart(userId);

  if (type === "CART") {
    await publishCartCleared({ userId });
  }
}

/* ======================================================
   MOVE CART → WISHLIST
====================================================== */
export async function moveCartToWishlist(itemId: string) {
  const existing = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!existing) throw new Error("Item not found");
  if (existing.type === "WISHLIST") return existing;

  const item = await prisma.cartItem.update({
    where: { id: itemId },
    data: { type: "WISHLIST" },
    include: { cart: true },
  });

  await deleteCart(item.cart.userId);

  return item;
}

/* ======================================================
   MOVE WISHLIST → CART
====================================================== */
export async function moveWishlistToCart(itemId: string) {
  const existing = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!existing) throw new Error("Item not found");
  if (existing.type === "CART") return existing;

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

  return item;
}
