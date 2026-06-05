// src/hooks/useCart.ts

"use client";

import { useCartStore } from "@/store/cartStore";

export const useCart =
  () => {
    const cartItems =
      useCartStore(
        (state) =>
          state.cartItems
      );

    const loading =
      useCartStore(
        (state) =>
          state.loading
      );

    const fetchCart =
      useCartStore(
        (state) =>
          state.fetchCart
      );

    const addItem =
      useCartStore(
        (state) =>
          state.addItem
      );

    const updateItem =
      useCartStore(
        (state) =>
          state.updateItem
      );

    const removeItem =
      useCartStore(
        (state) =>
          state.removeItem
      );

    const clear =
      useCartStore(
        (state) =>
          state.clear
      );

    const total =
      useCartStore(
        (state) =>
          state.cartTotal()
      );

    const count =
      useCartStore(
        (state) =>
          state.cartCount()
      );

    return {
      cartItems,

      loading,

      fetchCart,

      addItem,

      updateItem,

      removeItem,

      clear,

      total,

      count,
    };
  };
