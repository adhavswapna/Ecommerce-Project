"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createPayment } from "@/api/payments";
import { confirmOrder } from "@/api/checkout";
import { orderApi } from "@/api/apiClient";

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!orderId) {
        alert("Order ID missing");
        return;
      }

      setLoading(true);

      // ✅ STEP 1: Fetch order details
      const res = await orderApi.get(`/orders/${orderId}`);
      const order = res.data;

      // ✅ STEP 2: Correct payload (MATCH BACKEND)
      const payload = {
        userId: order.userId,
        orderId: order.id,
        amount: order.totalAmount,
        provider: method, // 🔥 IMPORTANT
        currency: "INR",
      };

      console.log("💳 PAYMENT PAYLOAD:", payload);

      // ✅ STEP 3: Create payment
      await createPayment(payload);

      // ✅ STEP 4: Confirm order (optional but fine)
      await confirmOrder(orderId);

      // ✅ STEP 5: Redirect
      router.push(`/orders/order-success?orderId=${orderId}`);
    } catch (err: any) {
      console.error("❌ Payment Error:", err?.response?.data || err);

      alert(
        err?.response?.data?.message ||
        "Payment failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Select Payment Method
      </h1>

      {/* PAYMENT OPTIONS */}
      <div className="space-y-3 mb-6">
        <label className="block">
          <input
            type="radio"
            value="COD"
            checked={method === "COD"}
            onChange={() => setMethod("COD")}
          />
          <span className="ml-2">Cash on Delivery</span>
        </label>

        <label className="block">
          <input
            type="radio"
            value="UPI"
            checked={method === "UPI"}
            onChange={() => setMethod("UPI")}
          />
          <span className="ml-2">UPI</span>
        </label>

        <label className="block">
          <input
            type="radio"
            value="CARD"
            checked={method === "CARD"}
            onChange={() => setMethod("CARD")}
          />
          <span className="ml-2">Credit/Debit Card</span>
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded w-full disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay & Place Order"}
      </button>
    </div>
  );
}
