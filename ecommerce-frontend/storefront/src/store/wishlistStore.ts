// src/store/wishlistStore.ts

"use client";

import { create } from "zustand";

import toast from "react-hot-toast";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  WishlistItem,
} from "@/api/wishlist";

interface WishlistState {
  wishlist: WishlistItem[];

  loading: boolean;

  fetchWishlist:
    () => Promise<void>;

  addItem: (
    productId: string,
    price?: number
  ) => Promise<void>;

  removeItem: (
    itemId: string
  ) => Promise<void>;

  isWishlisted: (
    productId: string
  ) => boolean;
}

export const useWishlistStore =
  create<WishlistState>(
    (set, get) => ({
      wishlist: [],

      loading: false,

      /**
       * ❤️ FETCH WISHLIST
       */
      fetchWishlist:
        async () => {
          try {
            set({
              loading: true,
            });

            /**
             * ✅ CHECK AUTH
             */
            if (
              typeof window ===
              "undefined"
            ) {
              return;
            }

            const token =
              localStorage.getItem(
                "token"
              );

            if (
              !token ||
              token ===
                "undefined"
            ) {
              set({
                wishlist: [],
              });

              return;
            }

            const data =
              await getWishlist();

            set({
              wishlist:
                Array.isArray(
                  data
                )
                  ? data
                  : [],
            });
          } catch (
            error
          ) {
            console.error(
              error
            );

            set({
              wishlist: [],
            });

            toast.error(
              "Failed to load wishlist"
            );
          } finally {
            set({
              loading: false,
            });
          }
        },

      /**
       * ❤️ ADD ITEM
       */
      addItem:
        async (
          productId,
          price = 0
        ) => {
          try {
            const exists =
              get().wishlist.some(
                (item) =>
                  item.productId ===
                  productId
              );

            if (exists) {
              toast(
                "Already in wishlist"
              );

              return;
            }

            await addToWishlist({
              productId,
              quantity: 1,
              price,
            });

            await get().fetchWishlist();

            toast.success(
              "Added to wishlist"
            );
          } catch (
            error
          ) {
            console.error(
              error
            );

            toast.error(
              "Failed to add wishlist item"
            );
          }
        },

      /**
       * ❌ REMOVE ITEM
       */
      removeItem:
        async (
          itemId
        ) => {
          try {
            await removeFromWishlist(
              itemId
            );

            await get().fetchWishlist();

            toast.success(
              "Removed from wishlist"
            );
          } catch (
            error
          ) {
            console.error(
              error
            );

            toast.error(
              "Failed to remove wishlist item"
            );
          }
        },

      /**
       * 🔍 CHECK ITEM
       */
      isWishlisted:
        (
          productId
        ) => {
          return get().wishlist.some(
            (item) =>
              item.productId ===
              productId
          );
        },
    })
  );
