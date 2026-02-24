"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  const fetchOrder = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`);
    const data = await res.json();
    setOrder(data.find((o: any) => o.id === id));
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleReturn = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/return/${id}`, { method: "POST" });
    fetchOrder();
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto border rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Order {order.id} Status</h1>
      <p>Status: {order.status}</p>
      {order.status === "DELIVERED" && (
        <button onClick={handleReturn} className="bg-red-600 text-white py-2 px-4 rounded mt-4">
          Return & Refund
        </button>
      )}
    </div>
  );
}

