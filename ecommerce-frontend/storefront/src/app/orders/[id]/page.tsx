"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "@/lib/orderApi";
import { requestRefund } from "@/lib/refundApi";
import { getInvoice } from "@/lib/invoiceApi";
import { useAuthStore } from "@/store/auth.store";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  refundStatus?: string;
  createdAt?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 Auth Guard
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // 📦 Fetch Order
  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id!);
      setOrder(data);
    } catch {
      setMessage("❌ Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  // 🔁 Refund Request
  const handleRefund = async () => {
    try {
      setProcessing(true);
      setMessage("");

      await requestRefund(id!);

      setMessage("✅ Refund requested successfully");
      fetchOrder();
    } catch (err: any) {
      setMessage(err.message || "Refund failed");
    } finally {
      setProcessing(false);
    }
  };

  // 📄 Invoice Download
  const handleInvoice = async () => {
    try {
      const data = await getInvoice(id!);

      const link = document.createElement("a");
      link.href = data.url;
      link.download = `Invoice_${id}.pdf`;
      link.click();
    } catch {
      setMessage("❌ Failed to download invoice");
    }
  };

  // 🧠 UI States
  if (loading) return <p className="p-6">Loading order...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 🔹 Header */}
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>

      <div className="mb-4 text-sm text-gray-600">
        <p>Order ID: {order.id}</p>
        {order.createdAt && (
          <p>
            Date: {new Date(order.createdAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* 🔹 Status */}
      <div className="mb-4">
        <p>
          Status:{" "}
          <span className="font-semibold">{order.status}</span>
        </p>

        {order.refundStatus && (
          <p className="text-yellow-600">
            Refund: {order.refundStatus}
          </p>
        )}
      </div>

      {/* 🔹 Items */}
      <div className="mt-4 space-y-3">
        <h2 className="font-semibold text-lg">Items</h2>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="border p-3 rounded flex justify-between"
          >
            <div>
              <p>Product ID: {item.productId}</p>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="font-medium">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Total */}
      <div className="mt-4 text-lg font-bold">
        Total: ₹{order.totalAmount}
      </div>

      {/* 🔹 Actions */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          onClick={handleInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Invoice
        </button>

        {order.status === "DELIVERED" &&
          order.refundStatus !== "REQUESTED" && (
            <button
              onClick={handleRefund}
              disabled={processing}
              className={`px-4 py-2 rounded text-white ${
                processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600"
              }`}
            >
              {processing ? "Processing..." : "Request Refund"}
            </button>
          )}
      </div>

      {/* 🔹 Message */}
      {message && (
        <p className="mt-4 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
