"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:3006/orders");
    const data = await res.json();
    setOrders(data);
  };

  const cancelOrder = async (orderId: string) => {
    await fetch(`http://localhost:3006/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    await fetch(`http://localhost:3007/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        amount: orders.find((o) => o.id === orderId)?.total,
        provider: "refund",
      }),
    });

    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.total}
            </p>
            <h4 className="mt-2 font-semibold">Items:</h4>
            <ul className="list-disc ml-6">
              {order.items.map((i: any) => (
                <li key={i.productId}>
                  {i.productId} x {i.quantity} = ₹{i.price * i.quantity}
                </li>
              ))}
            </ul>
            {order.status !== "CANCELLED" && (
              <button
                className="mt-2 bg-red-600 text-white py-1 px-3 rounded"
                onClick={() => cancelOrder(order.id)}
              >
                Cancel / Refund
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

