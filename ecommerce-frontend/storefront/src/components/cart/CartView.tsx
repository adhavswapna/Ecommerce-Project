"use client";

import { useCart } from "@/hooks/useCart";

export default function CartView() {
  const { cartItems, loading, increaseQty, decreaseQty, removeItem } = useCart();

  if (loading) {
    return <p className="p-6">Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return <p className="p-6">🛒 Cart is empty</p>;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b pb-4"
        >
          <div>
            <p className="font-semibold">{item.productId}</p>
            <p className="text-gray-500">₹{item.price}</p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => decreaseQty(item.id, item.quantity)}
              className="px-2 bg-gray-200 rounded"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => increaseQty(item.id, item.quantity)}
              className="px-2 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right font-bold text-lg">
        Total: ₹{total}
      </div>
    </div>
  );
}
