"use client";

import { useCartStore } from "@/store/cartStore";

export const useCart = () => {
  const store = useCartStore();

  return {
    cartItems: store.cartItems,
    loading: store.loading,

    fetchCart: store.fetchCart,

    // 🔥 FIX: old name compatibility
    addItem: store.addToCart,

    addToCart: store.addToCart,

    increaseQty: store.increaseQty,
    decreaseQty: store.decreaseQty,
    removeItem: store.removeItem,
    clearCart: store.clearCart,

    getItemByProductId: store.getItemByProductId,

    // 🔥 UI VALUES
    cartCount: store.cartCount,
    totalAmount: store.totalAmount,
  };
};
