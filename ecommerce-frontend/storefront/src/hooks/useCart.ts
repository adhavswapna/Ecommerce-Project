"use client";

import { useEffect, useState } from "react";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCartApi,
} from "@/api/cart";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const items = await getUserCart();
      setCartItems(items || []);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */
  const addItem = async (productId: string, quantity = 1) => {
    try {
      await addToCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
    }
  };

  /* ================= INCREASE ================= */
  const increaseQty = async (itemId: string, currentQty: number) => {
    try {
      await updateCartItem(itemId, currentQty + 1);

      // 🔥 Optimistic UI (faster UX)
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: currentQty + 1 }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Increase qty failed:", err);
    }
  };

  /* ================= DECREASE ================= */
  const decreaseQty = async (itemId: string, currentQty: number) => {
    try {
      if (currentQty <= 1) {
        await removeCartItem(itemId);
        setCartItems((prev) => prev.filter((i) => i.id !== itemId));
      } else {
        await updateCartItem(itemId, currentQty - 1);

        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: currentQty - 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("❌ Decrease qty failed:", err);
    }
  };

  /* ================= REMOVE ================= */
  const removeItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("❌ Remove item failed:", err);
    }
  };

  /* ================= CLEAR ================= */
  const clearCart = async () => {
    try {
      await clearCartApi();
      setCartItems([]);
    } catch (err) {
      console.error("❌ Clear cart failed:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    loading,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  };
}
