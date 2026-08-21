"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/api/cart";

/* ======================================================
   TYPES
====================================================== */

export interface CartItem {
  id: string;

  productId: string;

  name?: string;

  image?: string;

  price: number;

  quantity: number;

  type?: "CART" | "WISHLIST";
}

interface Address {
  addressLine1: string;

  city: string;

  state: string;

  pincode: string;

  phone: string;
}

interface CartState {
  items: CartItem[];

  loading: boolean;

  error: string | null;

  address: Address;

  setAddress: (
    address: Address
  ) => void;

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

/* ======================================================
   STORE
====================================================== */

export const useCartStore =
  create<CartState>((set, get) => ({
    /* ==================================================
       STATE
    ================================================== */

    items: [],

    loading: false,

    error: null,

    address: {
      addressLine1: "",

      city: "",

      state: "",

      pincode: "",

      phone: "",
    },

    /* ==================================================
       ADDRESS
    ================================================== */

    setAddress: (address) => {
      set({
        address,
      });
    },

    /* ==================================================
       FETCH CART
    ================================================== */

    fetchCart: async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await getCart();

        let items: CartItem[] = [];

        if (Array.isArray(data)) {
          items = data;
        } else if (
          data &&
          Array.isArray(data.items)
        ) {
          items = data.items;
        }

        set({
          items,
        });
      } catch (error: any) {
        console.error(
          "Failed to load cart:",
          error
        );

        const message =
          error?.response?.data?.message ||
          "Failed to load cart";

        set({
          error: message,
        });

        toast.error(message);
      } finally {
        set({
          loading: false,
        });
      }
    },

    /* ==================================================
       ADD ITEM
    ================================================== */

    addItem: async (
      productId,
      quantity = 1,
      price
    ) => {
      try {
        /* ==============================================
           VALIDATE PRODUCT
        ============================================== */

        if (!productId) {
          toast.error(
            "Product is required"
          );

          return;
        }

        /* ==============================================
           VALIDATE QUANTITY
        ============================================== */

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          toast.error(
            "Invalid quantity"
          );

          return;
        }

        /* ==============================================
           VALIDATE PRICE
        ============================================== */

        if (
          price === undefined ||
          price === null ||
          !Number.isFinite(Number(price)) ||
          Number(price) < 0
        ) {
          toast.error(
            "Product price is unavailable"
          );

          return;
        }

        /* ==============================================
           ADD TO BACKEND
        ============================================== */

        await addToCart({
          productId,

          quantity,

          price: Number(price),
        });

        /* ==============================================
           REFRESH CART
        ============================================== */

        await get().fetchCart();

        toast.success(
          "Added to cart"
        );
      } catch (error: any) {
        console.error(
          "Failed to add item:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to add item"
        );
      }
    },

    /* ==================================================
       UPDATE ITEM
    ================================================== */

    updateItem: async (
      itemId,
      quantity
    ) => {
      try {
        if (!itemId) {
          toast.error(
            "Cart item is required"
          );

          return;
        }

        /* ==============================================
           REMOVE WHEN ZERO
        ============================================== */

        if (quantity <= 0) {
          await get().removeItem(
            itemId
          );

          return;
        }

        if (
          !Number.isInteger(quantity)
        ) {
          toast.error(
            "Invalid quantity"
          );

          return;
        }

        /* ==============================================
           UPDATE BACKEND
        ============================================== */

        await updateCartItem(
          itemId,
          {
            quantity,
          }
        );

        /* ==============================================
           REFRESH CART
        ============================================== */

        await get().fetchCart();

        toast.success(
          "Cart updated"
        );
      } catch (error: any) {
        console.error(
          "Update cart item failed:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Update failed"
        );
      }
    },

    /* ==================================================
       REMOVE ITEM
    ================================================== */

    removeItem: async (
      itemId
    ) => {
      try {
        if (!itemId) {
          toast.error(
            "Cart item is required"
          );

          return;
        }

        await removeCartItem(
          itemId
        );

        await get().fetchCart();

        toast.success(
          "Removed from cart"
        );
      } catch (error: any) {
        console.error(
          "Remove cart item failed:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Remove failed"
        );
      }
    },

    /* ==================================================
       CLEAR CART
    ================================================== */

    clear: async () => {
      try {
        await clearCart();

        set({
          items: [],
        });

        toast.success(
          "Cart cleared"
        );
      } catch (error: any) {
        console.error(
          "Clear cart failed:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Clear failed"
        );
      }
    },

    /* ==================================================
       CART TOTAL
    ================================================== */

    cartTotal: () => {
      return get().items.reduce(
        (total, item) =>
          total +
          Number(item.price) *
            Number(item.quantity),

        0
      );
    },

    /* ==================================================
       CART COUNT
    ================================================== */

    cartCount: () => {
      return get().items.reduce(
        (total, item) =>
          total +
          Number(item.quantity),

        0
      );
    },
  }));
