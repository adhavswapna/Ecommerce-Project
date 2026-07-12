"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

import { getProducts, getProductById } from "@/api/products";
import { Product } from "@/types/product";

interface ProductState {
  products: Product[];
  product: Product | null;

  loadingList: boolean;
  loadingProduct: boolean;

  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;

  clearProduct: () => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,

  loadingList: false,
  loadingProduct: false,

  error: null,

  fetchProducts: async () => {
    try {
      set({
        loadingList: true,
        error: null,
      });

      console.log("Fetching products...");

      const products = await getProducts();

      console.log("Products:", products);

      set({
        products: Array.isArray(products) ? products : [],
      });
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to load products";

      set({
        error: message,
        products: [],
      });

      toast.error(message);
    } finally {
      set({
        loadingList: false,
      });
    }
  },

  fetchProduct: async (id: string) => {
    try {
      set({
        loadingProduct: true,
        error: null,
      });

      const product = await getProductById(id);

      set({
        product,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to load product";

      set({
        error: message,
      });

      toast.error(message);
    } finally {
      set({
        loadingProduct: false,
      });
    }
  },

  clearProduct: () =>
    set({
      product: null,
    }),

  clearError: () =>
    set({
      error: null,
    }),
}));
