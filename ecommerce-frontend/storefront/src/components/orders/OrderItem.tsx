// src/components/orders/OrderItem.tsx

"use client";

import Link from "next/link";

import { Order } from "@/types/order";

interface OrderItemProps {
  order: Order;
}

export default function OrderItem({
  order,
}: OrderItemProps) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-lg font-semibold">
            Order #{order.id}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <span className="text-sm font-medium">
            Status:
            {" "}
            <span className="text-blue-600">
              {order.status}
            </span>
          </span>

          <span className="text-sm font-medium mt-1">
            Payment:
            {" "}
            <span className="text-green-600">
              {order.paymentStatus}
            </span>
          </span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="mt-6">
        <p className="text-2xl font-bold">
          ₹
          {order.totalAmount}
        </p>

        <p className="text-sm text-gray-500">
          {order.items.length}
          {" "}
          item(s)
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap gap-3">

        <Link
          href={`/orders/${order.id}`}
          className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
        >
          View Details
        </Link>

        {order.paymentStatus ===
          "PENDING" && (
          <Link
            href={`/payments?orderId=${order.id}&amount=${order.totalAmount}`}
            className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-green-700 transition"
          >
            Pay Now
          </Link>
        )}

      </div>
    </div>
  );
}
