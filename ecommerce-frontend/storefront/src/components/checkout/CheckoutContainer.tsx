"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartItems } from "@/api/checkout";
import { createOrder } from "@/api/orders";
import { requireAuth, getUserFromToken } from "@/hooks/useAuth";
import CheckoutItem from "./CheckoutItem";

interface CartItem {
  id: string;
  productId: string;
  productName?: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutContainer() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requireAuth(router)) return;

    const user = getUserFromToken();
    if (!user?.userId) {
      router.push("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const data = await getCartItems(user.userId);
        setItems(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load checkout items");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      setPlacingOrder(true);

      const user = getUserFromToken();
      if (!user?.userId) return;

      const order = await createOrder({
        userId: user.userId,
        items,
        totalAmount: total,
      });

      // 🔥 Redirect to payment instead of success
      router.push(`/payment?orderId=${order.id}`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p className="p-6">Loading checkout...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!items.length) return <p className="p-6">Cart is empty</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="space-y-2">
        {items.map((item) => (
          <CheckoutItem key={item.id} item={item} />
        ))}
      </div>

      <div className="text-right text-lg font-semibold">
        Total: ₹{total.toFixed(2)}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => router.push("/cart")}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Back
        </button>

        <button
          onClick={placeOrder}
          disabled={placingOrder}
          className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {placingOrder ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
