// src/components/orders/OrdersList.tsx

"use client";

import { Order } from "@/types/order";

import OrderItem from "./OrderItem";

interface OrdersListProps {
  orders: Order[];
}

export default function OrdersList({
  orders,
}: OrdersListProps) {
  if (!orders.length) {
    return (
      <div className="bg-white border rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-semibold">
          No Orders Found
        </h2>

        <p className="text-gray-500 mt-2">
          You haven't placed any
          orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          order={order}
        />
      ))}
    </div>
  );
}
