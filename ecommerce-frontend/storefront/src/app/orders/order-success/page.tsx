"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Order Placed Successfully!
      </h1>

      <p className="mt-4">Order ID: {orderId}</p>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => router.push("/orders")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          View Orders
        </button>

        <button
          onClick={() => router.push("/")}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
