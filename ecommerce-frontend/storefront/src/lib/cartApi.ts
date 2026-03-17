import { api } from "./api";

const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

if (!CART_API) {
  throw new Error("NEXT_PUBLIC_CART_API_URL not defined");
}

/**
 * Decode JWT (simple)
 */
function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

/**
 * Add to cart
 */
export const addToCart = async (
  productId: string,
  price: number,
  quantity = 1
) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User not logged in");

  const res = await api.post(`${CART_API}/cart/add`, { userId, productId, price, quantity });
  return res.data;
};

/**
 * Remove from cart
 */
export const removeFromCart = async (productId: string) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User not logged in");

  const res = await api.post(`${CART_API}/cart/remove`, { userId, productId });
  return res.data;
};

/**
 * Fetch cart items
 */
export const getCartItems = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User not logged in");

  const res = await api.get(`${CART_API}/cart/${userId}`);
  return res.data;
};

/**
 * Checkout
 */
export const checkoutCart = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User not logged in");

  const res = await api.post(`${CART_API}/checkout`, { userId });
  return res.data;
};
