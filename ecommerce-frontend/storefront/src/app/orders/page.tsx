"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API_URL;

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const userId = getUserId();
    if (!userId) return;

    const res = await api.get(`${ORDER_API}/orders/user/${userId}`);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <p className="p-6">No orders yet</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded">
            <div className="flex justify-between">
              <p className="font-semibold">Order ID: {order.id}</p>
              <p className="text-sm text-gray-500">
                {order.status}
              </p>
            </div>

            <p className="mt-2">
              Total: ₹{order.totalAmount}
            </p>

            <div className="mt-3 space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="text-sm">
                  Product: {item.productId} | Qty: {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
