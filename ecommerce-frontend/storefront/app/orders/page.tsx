"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useOrder";
import { formatPrice } from "@/utils/formatPrice";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (!orders.length)
    return <p className="p-6 text-gray-500">No orders found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`}>
          <div className="border rounded-xl p-4 mb-4 hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between">
              <span className="font-medium">Order #{order.id}</span>
              <span className="text-sm">{order.status}</span>
            </div>

            <p className="text-gray-500 text-sm mt-2">
              {order.items.length} items
            </p>

            <p className="mt-2 font-semibold">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
