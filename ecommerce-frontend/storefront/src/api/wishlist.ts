import { cartApi } from "./apiClient";

export const addToWishlist = (productId: string) =>
  cartApi.post("/cart/wishlist/add", {
    productId,
    quantity: 1,
  });

export const getWishlist = () =>
  cartApi.get("/cart/wishlist");

export const removeFromWishlist = (id: string) =>
  cartApi.delete(`/cart/wishlist/remove/${id}`);

export const moveToCart = (id: string) =>
  cartApi.put(`/cart/cart/move/${id}`);
