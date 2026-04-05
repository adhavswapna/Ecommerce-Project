"use client";

import OrdersList from "@/components/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold p-6">My Orders</h1>
      <OrdersList />
    </div>
  );
}
