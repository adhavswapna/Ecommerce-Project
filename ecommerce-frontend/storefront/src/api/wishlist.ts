// src/api/wishlist.ts

import { cartApi } from "./apiClient";

export interface WishlistItem {
  id: string;

  cartId: string;

  productId: string;

  quantity: number;

  price: number;

  type?: string;

  product?: {
    id: string;

    name: string;

    image?: string;

    price: number;
  };
}

/**
 * ❤️ GET WISHLIST
 */
export const getWishlist =
  async (): Promise<
    WishlistItem[]
  > => {
    const response =
      await cartApi.get(
        "/cart/wishlist"
      );

    console.log(
      "GET WISHLIST RESPONSE:",
      response.data
    );

    return (
      response.data?.items ||
      response.data?.wishlist ||
      response.data?.data?.items ||
      response.data ||
      []
    );
  };

/**
 * ❤️ ADD TO WISHLIST
 */
export const addToWishlist =
  async (data: {
    productId: string;

    quantity?: number;

    price?: number;
  }): Promise<WishlistItem> => {
    const response =
      await cartApi.post(
        "/cart/wishlist/add",
        data
      );

    console.log(
      "ADD WISHLIST RESPONSE:",
      response.data
    );

    return response.data;
  };

/**
 * ❌ REMOVE WISHLIST ITEM
 */
export const removeFromWishlist =
  async (
    itemId: string
  ): Promise<void> => {
    const response =
      await cartApi.delete(
        `/cart/wishlist/remove/${itemId}`
      );

    console.log(
      "REMOVE WISHLIST RESPONSE:",
      response.data
    );
  };
