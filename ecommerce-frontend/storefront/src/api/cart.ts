import { cartApi } from "./apiClient";

/**
 * ➕ ADD TO CART (NO PRICE NEEDED)
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
) {
  const res = await cartApi.post("/cart/add", {
    productId,
    quantity,
  });

  return res.data;
}

/**
 * ❤️ ADD TO WISHLIST
 */
export async function addToWishlist(productId: string) {
  const res = await cartApi.post("/cart/wishlist/add", {
    productId,
    quantity: 1,
  });

  return res.data;
}

/**
 * 🛒 GET CART
 */
export async function getUserCart() {
  const res = await cartApi.get("/cart");
  return res.data;
}

/**
 * ❤️ GET WISHLIST
 */
export async function getWishlist() {
  const res = await cartApi.get("/cart/wishlist");
  return res.data;
}

/**
 * 🔄 UPDATE ITEM
 */
export async function updateCartItem(itemId: string, quantity: number) {
  const res = await cartApi.put(`/cart/update/${itemId}`, {
    quantity,
  });

  return res.data;
}

/**
 * ❌ REMOVE ITEM
 */
export async function removeCartItem(itemId: string) {
  const res = await cartApi.delete(`/cart/remove/${itemId}`);
  return res.data;
}

/**
 * 🔁 MOVE WISHLIST → CART
 */
export async function moveToCart(itemId: string) {
  const res = await cartApi.put(`/cart/wishlist/move/${itemId}`);
  return res.data;
}

/**
 * 🧹 CLEAR CART
 */
export async function clearCartApi() {
  const res = await cartApi.delete(`/cart/clear`);
  return res.data;
}
