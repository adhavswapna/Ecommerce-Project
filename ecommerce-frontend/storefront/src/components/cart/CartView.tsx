"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function CartView() {
  const { cartItems, loading } = useCart();
  const router = useRouter();

  if (loading) return <p className="p-6">Loading...</p>;

  if (cartItems.length === 0) {
    return <p className="p-6">Cart is empty</p>;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cart</h1>

      {cartItems.map((item) => (
        <div key={item.id} className="border p-4 mt-4 rounded">
          <p><b>Product:</b> {item.productId}</p>
          <p><b>Qty:</b> {item.quantity}</p>
          <p><b>Price:</b> ₹{item.price}</p>
        </div>
      ))}

      <h2 className="mt-4 font-semibold text-lg">
        Total: ₹{total}
      </h2>

      {/* ✅ FIX: Redirect to checkout */}
      <button
        onClick={() => router.push("/checkout")}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
