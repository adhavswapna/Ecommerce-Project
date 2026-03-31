"use client";

import { useRouter } from "next/navigation";
import { useInvoice } from "@/hooks/useInvoice";

export default function OrderItem({ order }: { order: any }) {
  const router = useRouter();
  const { download, loading } = useInvoice();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigation to order details
    await download(order.id);
  };

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  }[order.status] || "bg-gray-100 text-gray-700";

  return (
    <div
      className="border p-4 rounded mb-4 cursor-pointer hover:shadow-lg transition bg-white"
      onClick={() => router.push(`/orders/${order.id}`)}
    >
      {/* Top row */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          Order ID: <span className="text-gray-700">{order.id}</span>
        </p>

        <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
          {order.status}
        </span>
      </div>

      {/* Amount */}
      <p className="mt-2 text-gray-800">
        Total: <span className="font-semibold">₹{order.totalAmount}</span>
      </p>

      {/* Invoice Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="px-4 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Generating Invoice..." : "📄 Download Invoice"}
        </button>
      </div>
    </div>
  );
}
