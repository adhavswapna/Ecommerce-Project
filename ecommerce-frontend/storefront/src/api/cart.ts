// src/api/cart.ts

import { cartApi } from "./apiClient";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;

  product?: {
    id: string;
    name: string;
    image?: string;
    price: number;
  };
}

/**
 * 📦 GET CART
 */
export const getCart =
  async (): Promise<CartItem[]> => {
    const response =
      await cartApi.get("/cart");

    console.log(
      "GET CART RESPONSE:",
      response.data
    );

    const data =
      response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (
      data?.data &&
      Array.isArray(data.data)
    ) {
      return data.data;
    }

    if (
      data?.items &&
      Array.isArray(data.items)
    ) {
      return data.items;
    }

    if (
      data?.cart?.items &&
      Array.isArray(
        data.cart.items
      )
    ) {
      return data.cart.items;
    }

    if (
      data?.data?.items &&
      Array.isArray(
        data.data.items
      )
    ) {
      return data.data.items;
    }

    return [];
  };

/**
 * ➕ ADD TO CART
 */
export const addToCart =
  async (data: {
    productId: string;
    quantity: number;
    price?: number;
  }): Promise<CartItem> => {
    const response =
      await cartApi.post(
        "/cart/add",
        data
      );

    console.log(
      "ADD CART RESPONSE:",
      response.data
    );

    return response.data;
  };

/**
 * ✏️ UPDATE CART ITEM
 */
export const updateCartItem =
  async (
    itemId: string,
    quantity: number
  ): Promise<void> => {
    const response =
      await cartApi.put(
        `/cart/update/${itemId}`,
        {
          quantity,
        }
      );

    console.log(
      "UPDATE CART RESPONSE:",
      response.data
    );
  };

/**
 * ❌ REMOVE ITEM
 */
export const removeFromCart =
  async (
    itemId: string
  ): Promise<void> => {
    const response =
      await cartApi.delete(
        `/cart/remove/${itemId}`
      );

    console.log(
      "REMOVE CART RESPONSE:",
      response.data
    );
  };

/**
 * 🧹 CLEAR CART
 */
export const clearCart =
  async (): Promise<void> => {
    const response =
      await cartApi.delete(
        "/cart/clear"
      );

    console.log(
      "CLEAR CART RESPONSE:",
      response.data
    );
  };
