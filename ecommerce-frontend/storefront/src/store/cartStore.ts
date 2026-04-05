"use client";

import { create } from "zustand";
import { cartApi } from "@/api/apiClient";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

type CartState = {
  cartItems: CartItem[];
  loading: boolean;

  // 🔥 derived values
  cartCount: number;
  totalAmount: number;

  // actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  increaseQty: (id: string) => Promise<void>;
  decreaseQty: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;

  getItemByProductId: (productId: string) => CartItem | undefined;
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loading: false,

  cartCount: 0,
  totalAmount: 0,

  // 🛒 FETCH CART
  fetchCart: async () => {
    set({ loading: true });

    try {
      const res = await cartApi.get("/cart");

      const items = res.data || [];

      // 🔥 calculate values
      const cartCount = items.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0
      );

      const totalAmount = items.reduce(
        (acc: number, item: CartItem) => acc + item.quantity * item.price,
        0
      );

      set({
        cartItems: items,
        cartCount,
        totalAmount,
      });
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ➕ ADD TO CART (supports quantity)
  addToCart: async (productId, quantity = 1) => {
    try {
      await cartApi.post("/cart/add", {
        productId,
        quantity,
      });

      await get().fetchCart(); // 🔥 refresh globally
    } catch (err) {
      console.error("Add to cart failed:", err);
      throw err;
    }
  },

  // 🔼 INCREASE
  increaseQty: async (id) => {
    const item = get().cartItems.find((i) => i.id === id);
    if (!item) return;

    try {
      await cartApi.put(`/cart/update/${id}`, {
        quantity: item.quantity + 1,
      });

      await get().fetchCart();
    } catch (err) {
      console.error("Increase qty failed:", err);
    }
  },

  // 🔽 DECREASE
  decreaseQty: async (id) => {
    const item = get().cartItems.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;

    try {
      await cartApi.put(`/cart/update/${id}`, {
        quantity: item.quantity - 1,
      });

      await get().fetchCart();
    } catch (err) {
      console.error("Decrease qty failed:", err);
    }
  },

  // ❌ REMOVE
  removeItem: async (id) => {
    try {
      await cartApi.delete(`/cart/remove/${id}`);
      await get().fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  },

  // 🔍 FIND ITEM
  getItemByProductId: (productId) => {
    return get().cartItems.find((i) => i.productId === productId);
  },
}));
