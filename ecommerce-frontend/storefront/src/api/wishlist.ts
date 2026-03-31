import { addToCart, getUserCart } from "./cart";
import { cartApi } from "./apiClient";

export async function getWishlistItems(userId: string) {
  try {
    return await getUserCart(userId);
  } catch (error) {
    console.error("Wishlist API error:", error);
    throw error;
  }
}

export async function addToWishlist(
  userId: string,
  productId: string,
  price: number,
  quantity = 1
) {
  return await addToCart(userId, productId, price, quantity);
}

export async function removeFromWishlist(itemId: string) {
  const res = await cartApi.delete(`/remove/${itemId}`);
  return res.data;
}
