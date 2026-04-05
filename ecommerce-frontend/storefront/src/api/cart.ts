import { cartApi } from "./apiClient";

/**
 * ➕ ADD TO CART
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
 * 🛒 GET CART
 */
export async function getUserCart() {
  const res = await cartApi.get("/cart");
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
 * 🧹 CLEAR CART
 */
export async function clearCartApi() {
  const res = await cartApi.delete(`/cart/clear`);
  return res.data;
}
