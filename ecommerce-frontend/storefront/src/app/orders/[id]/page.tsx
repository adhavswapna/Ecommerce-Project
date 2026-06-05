"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useOrders } from "@/hooks/useOrders";
import InvoiceButton from "@/components/orders/InvoiceButton";

export default function OrderDetailsPage() {
  const params = useParams();

  const { order, loading, fetchOrder } = useOrders();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      setError(null);

      try {
        const res = await fetchOrder(params.id as string);

        if (!res) {
          setError("Order not found or failed to load");
        }
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("Failed to load order");
      }
    };

    load();
  }, [params?.id, fetchOrder]);

  // ================= LOADING =================
  if (loading && !order) {
    return (
      <div className="p-10 text-lg">
        Loading order...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="p-10">
        <p className="text-red-600 font-medium">{error}</p>

        <Link
          href="/orders"
          className="inline-block mt-4 border px-5 py-2 rounded-xl"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  // ================= NO ORDER =================
  if (!order) {
    return (
      <div className="p-10 text-gray-500">
        No order found
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Order Details</h1>
          <p className="text-gray-500 mt-2">
            View your order summary and payment information
          </p>
        </div>

        <Link
          href="/orders"
          className="border px-5 py-2 rounded-xl hover:bg-gray-100"
        >
          Back
        </Link>
      </div>

      <div className="mt-10 border rounded-2xl p-8 shadow-sm bg-white">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium break-all">{order.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order Status</p>
            <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {order.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                order.paymentStatus === "SUCCESS"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold">₹{order.totalAmount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            href={`/payments?orderId=${order.id}&amount=${order.totalAmount}`}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Pay Now
          </Link>

          <InvoiceButton
            orderId={order.id}
            amount={order.totalAmount}
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Order Items</h2>

        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-6 flex justify-between"
            >
              <div>
                <p className="font-medium">Product ID</p>
                <p className="text-sm text-gray-500 break-all">
                  {item.productId}
                </p>
              </div>

              <div className="text-right">
                <p>
                  Qty: <span className="font-semibold">{item.quantity}</span>
                </p>
                <p className="text-xl font-bold mt-2">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
