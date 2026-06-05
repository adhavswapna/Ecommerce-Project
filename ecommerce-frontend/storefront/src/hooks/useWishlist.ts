// src/hooks/useWishlist.ts

"use client";

import {
  useEffect,
} from "react";

import {
  useWishlistStore,
} from "@/store/wishlistStore";

export const useWishlist =
  () => {
    const {
      wishlist,
      loading,
      fetchWishlist,
      addItem,
      removeItem,
      clearAll,
      isWishlisted,
    } =
      useWishlistStore();

    useEffect(() => {
      fetchWishlist();
    }, [fetchWishlist]);

    return {
      wishlist,
      loading,
      fetchWishlist,
      addItem,
      removeItem,
      clearAll,
      isWishlisted,
    };
  };
