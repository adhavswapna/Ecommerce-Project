import { cartApi } from "./apiClient";

export const getCartItems = async (userId: string) => {
  try {
    const res = await cartApi.get(`/cart/${userId}`);
    return res.data || [];
  } catch (err) {
    console.error("Cart API error:", err);
    return [];
  }
};

export const clearCart = async (userId: string) => {
  try {
    await cartApi.delete(`/cart/clear/${userId}`);
  } catch (err) {
    console.error("Clear cart error:", err);
  }
};
