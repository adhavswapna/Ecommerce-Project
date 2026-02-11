"use client";

import { useCartStore } from "../../store/cart.store";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.totalAmount());

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-primary underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 rounded bg-white shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ₹{total}</p>
        <div className="flex gap-2">
          <button
            onClick={clearCart}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Clear Cart
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

