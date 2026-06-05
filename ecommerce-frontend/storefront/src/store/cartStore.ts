// src/store/cartStore.ts

"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
  CartItem,
} from "@/api/cart";

interface CartState {
  cartItems: CartItem[];

  loading: boolean;

  fetchCart: () => Promise<void>;

  addItem: (
    productId: string,
    quantity?: number,
    price?: number
  ) => Promise<void>;

  updateItem: (
    itemId: string,
    quantity: number
  ) => Promise<void>;

  removeItem: (
    itemId: string
  ) => Promise<void>;

  clear: () => Promise<void>;

  cartTotal: () => number;

  cartCount: () => number;
}

export const useCartStore =
  create<CartState>(
    (set, get) => ({
      cartItems: [],

      loading: false,

      /**
       * 📦 FETCH CART
       */
      fetchCart: async () => {
        try {
          console.log(
            "FETCH CART START"
          );

          set({
            loading: true,
          });

          const items =
            await getCart();

          console.log(
            "GET CART RESULT:",
            items
          );

          set({
            cartItems:
              Array.isArray(
                items
              )
                ? items
                : [],
          });

          console.log(
            "STORE UPDATED:",
            get()
              .cartItems
          );
        } catch (
          error
        ) {
          console.error(
            "FETCH CART ERROR:",
            error
          );

          toast.error(
            "Failed to load cart"
          );
        } finally {
          set({
            loading: false,
          });
        }
      },

      /**
       * ➕ ADD ITEM
       */
      addItem: async (
        productId,
        quantity = 1,
        price = 0
      ) => {
        try {
          console.log(
            "STEP 1 - START ADD ITEM"
          );

          const result =
            await addToCart({
              productId,
              quantity,
              price,
            });

          console.log(
            "STEP 2 - ADD SUCCESS",
            result
          );

          console.log(
            "STEP 3 - FETCHING CART"
          );

          await get().fetchCart();

          console.log(
            "STEP 4 - FETCH COMPLETE"
          );

          console.log(
            "CURRENT CART:",
            get()
              .cartItems
          );

          toast.success(
            "Added to cart"
          );
        } catch (
          error
        ) {
          console.error(
            "ADD ITEM ERROR:",
            error
          );

          toast.error(
            "Failed to add to cart"
          );
        }
      },

      /**
       * ✏️ UPDATE ITEM
       */
      updateItem: async (
        itemId,
        quantity
      ) => {
        try {
          console.log(
            "UPDATE ITEM:",
            itemId,
            quantity
          );

          await updateCartItem(
            itemId,
            quantity
          );

          await get().fetchCart();

          toast.success(
            "Cart updated"
          );
        } catch (
          error
        ) {
          console.error(
            "UPDATE CART ERROR:",
            error
          );

          toast.error(
            "Failed to update cart"
          );
        }
      },

      /**
       * ❌ REMOVE ITEM
       */
      removeItem: async (
        itemId
      ) => {
        try {
          console.log(
            "REMOVE ITEM:",
            itemId
          );

          await removeFromCart(
            itemId
          );

          await get().fetchCart();

          toast.success(
            "Item removed"
          );
        } catch (
          error
        ) {
          console.error(
            "REMOVE CART ERROR:",
            error
          );

          toast.error(
            "Failed to remove item"
          );
        }
      },

      /**
       * 🧹 CLEAR CART
       */
      clear: async () => {
        try {
          console.log(
            "CLEAR CART START"
          );

          await clearCart();

          set({
            cartItems: [],
          });

          console.log(
            "CART CLEARED"
          );

          toast.success(
            "Cart cleared"
          );
        } catch (
          error
        ) {
          console.error(
            "CLEAR CART ERROR:",
            error
          );

          toast.error(
            "Failed to clear cart"
          );
        }
      },

      /**
       * 💰 TOTAL
       */
      cartTotal: () => {
        return get().cartItems.reduce(
          (
            total,
            item
          ) =>
            total +
            item.price *
              item.quantity,
          0
        );
      },

      /**
       * 🔢 COUNT
       */
      cartCount: () => {
        return get().cartItems.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,
          0
        );
      },
    })
  );
