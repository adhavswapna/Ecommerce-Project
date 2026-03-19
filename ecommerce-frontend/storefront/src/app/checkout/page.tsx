"use client";

import { useEffect, useState } from "react";
import { checkoutCart } from "@/lib/cartApi";
import { createPayment } from "@/lib/paymentApi";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const router = useRouter();

  // ✅ Fetch cart summary
  const fetchCart = async () => {
    try {
      const res = await api.get(`${CART_API}/cart`);
      const items = res.data || [];

      setCartItems(items);

      const totalAmount = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      setTotal(totalAmount);
    } catch (err) {
      console.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Checkout + Payment Flow
  const handleCheckout = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Order from Cart
      const order = await checkoutCart();

      if (!order?.id) {
        throw new Error("Invalid order response");
      }

      // 2️⃣ Create Payment
      const payment = await createPayment(order.id);

      // 3️⃣ Redirect to payment gateway (if exists)
      if (payment?.paymentUrl) {
        window.location.href = payment.paymentUrl;
        return;
      }

      // 4️⃣ Fallback (COD or direct success)
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* 🛒 Cart Summary */}
      <div className="border rounded p-4 mb-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>

        {cartItems.length === 0 && <p>No items in cart</p>}

        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between py-1">
            <span>
              {item.productId} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* 💳 Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading || cartItems.length === 0}
        className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}
