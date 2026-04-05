"use client";

import { requestRefund } from "@/api/orders";

export default function OrderItem({ order, refresh }: any) {
  const handleRefund = async () => {
    try {
      await requestRefund(order.id);
      alert("Refund requested 💸");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Refund failed ❌");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <div>
          <p className="font-semibold">Order ID: {order.id}</p>
          <p className="text-sm text-gray-500">
            Status: {order.status}
          </p>
        </div>

        <p className="font-bold">₹{order.totalAmount}</p>
      </div>

      {/* ITEMS */}
      <div className="space-y-2">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.productId}</span>
            <span>Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      {/* ACTION */}
      <button
        onClick={handleRefund}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Request Refund
      </button>
    </div>
  );
}
