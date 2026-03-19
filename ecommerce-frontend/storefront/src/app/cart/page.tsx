"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

/* ================= HELPER ================= */
function getUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const userId = getUserId();

      if (!userId) {
        router.push("/login");
        return;
      }

      const res = await api.get(`${CART_API}/cart/${userId}`);
      setItems(res.data || []);
    } catch (err: any) {
      console.error("Cart error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= UPDATE ================= */
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    await api.put(`${CART_API}/cart/update/${itemId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await api.delete(`${CART_API}/cart/remove/${itemId}`);
    fetchCart();
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    await api.delete(`${CART_API}/cart/clear/${userId}`);
    fetchCart();
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= UI ================= */

  if (loading) return <p className="p-6">Loading cart...</p>;

  if (items.length === 0) {
    return <p className="p-6">🛒 Your cart is empty</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Product ID: {item.productId}
              </p>
              <p>₹{item.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1)
                }
                className="px-2 bg-gray-200 rounded"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
                className="px-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-bold">
          Total: ₹{total.toFixed(2)}
        </h2>

        <div className="flex gap-4 mt-4">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
