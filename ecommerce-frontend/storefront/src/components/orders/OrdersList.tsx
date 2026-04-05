"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "@/api/orders";
import OrderItem from "./OrderItem";

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="p-6">No orders found</p>;

  return (
    <div className="p-6 space-y-6">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} refresh={fetchOrders} />
      ))}
    </div>
  );
}
