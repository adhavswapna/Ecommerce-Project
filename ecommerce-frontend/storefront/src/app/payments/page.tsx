"use client";

import { useSearchParams } from "next/navigation";
import PaymentView from "@/components/payment/PaymentView";
import PaymentCard from "@/components/payment/PaymentCard";
import { usePayments } from "@/hooks/usePayments";

export default function Page() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  // ❌ Not logged in
  if (!userId) {
    return (
      <p className="p-6 text-red-500">
        You must be logged in to view payments.
      </p>
    );
  }

  const { payments, loading, error } = usePayments(userId);

  // ⏳ Loading
  if (loading) {
    return <p className="p-6 text-gray-500">Loading payments...</p>;
  }

  // ❌ Error
  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  // 👉 SINGLE PAYMENT VIEW
  if (orderId) {
    const payment = payments.find((p) => p.id === orderId);

    if (!payment) {
      return (
        <p className="p-6 text-gray-500">
          No payment found for order ID: {orderId}
        </p>
      );
    }

    return (
      <div className="p-6">
        <h2 className="font-bold mb-4">Payment Details</h2>
        <PaymentCard payment={payment} />
      </div>
    );
  }

  // 👉 ALL PAYMENTS
  return <PaymentView userId={userId} />;
}
