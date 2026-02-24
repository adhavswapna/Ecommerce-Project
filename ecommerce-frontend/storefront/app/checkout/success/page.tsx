"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`http://127.0.0.1:3006/orders`)
      .then((res) => res.json())
      .then((data) => {
        const o = data.find((ord: any) => ord.id === orderId);
        setOrder(o);
      });
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Successful!</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <h2 className="mt-4 font-bold">Items:</h2>
      <ul className="list-disc ml-6">
        {order.items.map((i: any) => (
          <li key={i.productId}>
            {i.productId} x {i.quantity} = ₹{i.price * i.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

