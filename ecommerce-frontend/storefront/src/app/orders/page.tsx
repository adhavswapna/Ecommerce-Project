// src/app/orders/page.tsx

"use client";

import {
  useEffect,
} from "react";

import OrdersList from "@/components/orders/OrdersList";

import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const {
    orders,
    loading,
    fetchOrders,
  } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          My Orders
        </h1>

        <p className="text-gray-500 mt-2">
          Track and manage your
          orders
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          Loading orders...
        </div>
      ) : (
        <OrdersList
          orders={orders}
        />
      )}

    </main>
  );
}
