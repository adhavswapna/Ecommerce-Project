"use client";

import { useParams } from "next/navigation";
import { useOrderDetails } from "@/hooks/useOrder";
import { formatPrice } from "@/utils/formatPrice";

export default function OrderDetailsPage() {
  const params = useParams();
  const { order, loading } = useOrderDetails(params.id as string);

  if (loading || !order)
    return <p className="p-6">Loading order...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Order #{order.id}
      </h1>

      <p className="mb-2">Status: {order.status}</p>

      <p className="mb-6 font-semibold">
        Total: {formatPrice(order.totalAmount)}
      </p>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between border-b pb-3"
          >
            <div>
              <p>{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>
            <p>{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
