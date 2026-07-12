import { apiClient } from "./apiClient";

/* ======================================================
   GET CART
====================================================== */

export const getCart = async () => {
  const res = await apiClient.get("/cart/");
  return res.data;
};

/* ======================================================
   ADD TO CART
====================================================== */

export const addToCart = async (payload: any) => {
  const res = await apiClient.post(
    "/cart/add",
    payload
  );

  return res.data;
};

/* ======================================================
   UPDATE CART ITEM
====================================================== */

export const updateCartItem = async (
  id: string,
  payload: any
) => {
  const res = await apiClient.put(
    `/cart/update/${id}`,
    payload
  );

  return res.data;
};

/* ======================================================
   REMOVE CART ITEM
====================================================== */

export const removeCartItem = async (
  id: string
) => {
  const res = await apiClient.delete(
    `/cart/remove/${id}`
  );

  return res.data;
};

/* ======================================================
   CLEAR CART
====================================================== */

export const clearCart = async () => {
  const res = await apiClient.delete(
    "/cart/clear"
  );

  return res.data;
};

/* ======================================================
   WISHLIST
====================================================== */

export const getWishlist = async () => {
  const res = await apiClient.get("/cart/wishlist");
  return res.data;
};

export const addToWishlist = async (payload: any) => {
  const res = await apiClient.post(
    "/cart/wishlist/add",
    payload
  );

  return res.data;
};

export const removeWishlistItem = async (
  id: string
) => {
  const res = await apiClient.delete(
    `/cart/wishlist/remove/${id}`
  );

  return res.data;
};

export const clearWishlist = async () => {
  const res = await apiClient.delete(
    "/cart/wishlist/clear"
  );

  return res.data;
};

export const moveToWishlist = async (
  id: string
) => {
  const res = await apiClient.put(
    `/cart/move-to-wishlist/${id}`
  );

  return res.data;
};

export const moveToCart = async (
  id: string
) => {
  const res = await apiClient.put(
    `/cart/wishlist/move-to-cart/${id}`
  );

  return res.data;
};
