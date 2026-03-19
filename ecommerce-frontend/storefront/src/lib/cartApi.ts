import { api } from "./api";

const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

if (!CART_API) {
  throw new Error("NEXT_PUBLIC_CART_API_URL not defined");
}

/**
 * Get userId from token (safe wrapper)
 */
const getUserId = (): string => {
  if (typeof window === "undefined") {
    throw new Error("Window not available");
  }

  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.userId) throw new Error("Invalid token");
    return payload.userId;
  } catch {
    throw new Error("Invalid token format");
  }
};

/**
 * Add to cart
 */
export const addToCart = async (
  productId: string,
  price: number,
  quantity = 1
) => {
  try {
    const userId = getUserId();

    const res = await api.post(`${CART_API}/cart/add`, {
      userId,
      productId,
      price,
      quantity,
    });

    return res.data;
  } catch (error: any) {
    console.error("Add to cart failed:", error?.response?.data || error.message);
    throw new Error("Failed to add to cart");
  }
};

/**
 * Remove from cart
 */
export const removeFromCart = async (productId: string) => {
  try {
    const userId = getUserId();

    const res = await api.post(`${CART_API}/cart/remove`, {
      userId,
      productId,
    });

    return res.data;
  } catch (error: any) {
    console.error("Remove from cart failed:", error?.response?.data || error.message);
    throw new Error("Failed to remove item");
  }
};

/**
 * Fetch cart items
 */
export const getCartItems = async () => {
  try {
    const userId = getUserId();

    const res = await api.get(`${CART_API}/cart/${userId}`);
    return res.data;
  } catch (error: any) {
    console.error("Fetch cart failed:", error?.response?.data || error.message);
    throw new Error("Failed to fetch cart");
  }
};

/**
 * Checkout cart
 */
export const checkoutCart = async () => {
  try {
    const userId = getUserId();

    const res = await api.post(`${CART_API}/checkout`, { userId });
    return res.data;
  } catch (error: any) {
    console.error("Checkout failed:", error?.response?.data || error.message);
    throw new Error("Checkout failed");
  }
};
