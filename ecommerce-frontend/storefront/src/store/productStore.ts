"use client";

import { create } from "zustand";

import toast from "react-hot-toast";

import {
  getProducts,
  getProductById,
} from "@/api/products";

import {
  Product,
} from "@/types/product";

interface ProductState {
  products: Product[];

  product: Product | null;

  loading: boolean;

  fetchProducts:
    () => Promise<void>;

  fetchProduct:
    (
      id: string
    ) => Promise<void>;
}

export const useProductStore =
  create<ProductState>(
    (set) => ({
      products: [],

      product: null,

      loading: false,

      fetchProducts:
        async () => {
          try {
            set({
              loading: true,
            });

            const products =
              await getProducts();

            set({
              products,
            });
          } catch (error) {
            console.error(error);

            toast.error(
              "Failed to load products"
            );
          } finally {
            set({
              loading: false,
            });
          }
        },

      fetchProduct:
        async (id) => {
          try {
            set({
              loading: true,
            });

            const product =
              await getProductById(
                id
              );

            set({
              product,
            });
          } catch (error) {
            console.error(error);

            toast.error(
              "Failed to load product"
            );
          } finally {
            set({
              loading: false,
            });
          }
        },
    })
  );
