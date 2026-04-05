"use client";

import { create } from "zustand";
import { cartApi } from "@/api/apiClient";

type WishlistItem = {
  id: string;
  productId: string;
  quantity: number;
};

type WishlistState = {
  items: WishlistItem[];

  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  fetchWishlist: async () => {
    try {
      const res = await cartApi.get("/cart/wishlist");
      set({ items: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  addItem: async (productId) => {
    // ⚡ Optimistic UI
    const tempItem = {
      id: "temp-" + productId,
      productId,
      quantity: 1,
    };

    set((state) => ({
      items: [...state.items, tempItem],
    }));

    try {
      await cartApi.post("/cart/wishlist/add", {
        productId,
        quantity: 1,
      });

      await get().fetchWishlist(); // sync
    } catch (err) {
      console.error(err);

      // rollback
      set((state) => ({
        items: state.items.filter((i) => i.id !== tempItem.id),
      }));
    }
  },

  removeItem: async (id) => {
    // ⚡ Optimistic remove
    const prev = get().items;

    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));

    try {
      await cartApi.delete(`/cart/wishlist/remove/${id}`);
    } catch (err) {
      console.error(err);
      set({ items: prev }); // rollback
    }
  },

  isWishlisted: (productId) => {
    return get().items.some((i) => i.productId === productId);
  },
}));
