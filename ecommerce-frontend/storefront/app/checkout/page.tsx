"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/order.api";
import { createPayment } from "@/lib/api/payment.api";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.totalAmount());
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi" | "netbanking">("cod");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (paymentMethod === "card" && !cardNumber.trim()) {
      setError("Card number required");
      return;
    }

    if (!items || items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Order
      const orderPayload = {
        userId: "demo-user", // replace with actual logged-in user
        totalAmount: total,
        currency,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      };

      const order = await createOrder(orderPayload);
      const orderId = order.id;

      if (!orderId) throw new Error("Order ID not received");

      // 2️⃣ Process Payment
      const payment = await createPayment({
        userId: "demo-user",
        orderId,
        amount: total,
        currency,
        provider: paymentMethod,
        cardNumber: paymentMethod === "card" ? cardNumber : undefined,
        name,
      });

      if (!payment || payment.status === "FAILED") {
        throw new Error("Payment failed");
      }

      // ✅ Success
      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded mt-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <label className="block mb-3">
        Currency:
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "INR" | "USD")}
          className="border p-2 rounded ml-2"
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
        </select>
      </label>

      <label className="block mb-3">
        Payment Method:
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as "cod" | "card" | "upi" | "netbanking")}
          className="border p-2 rounded ml-2"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="upi">UPI</option>
          <option value="netbanking">NetBanking</option>
          <option value="card">Card</option>
        </select>
      </label>

      <p className="mb-4 font-semibold text-lg">
        Total: {currency === "INR" ? "₹" : "$"}
        {total}
      </p>

      <form onSubmit={handlePayment} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {paymentMethod === "card" && (
          <input
            type="text"
            placeholder="Card Number"
            className="border p-2 rounded"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

