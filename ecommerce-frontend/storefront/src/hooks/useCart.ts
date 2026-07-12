"use client";

import { useCartStore } from "@/store/cartStore";

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const loading = useCartStore((s) => s.loading);
  const error = useCartStore((s) => s.error);

  const fetchCart = useCartStore((s) => s.fetchCart);
  const addItem = useCartStore((s) => s.addItem);
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const total = useCartStore((s) => s.cartTotal());
  const count = useCartStore((s) => s.cartCount());

  return {
    items,
    loading,
    error,

    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clear,

    total,
    count,
  };
};
