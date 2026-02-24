"use client";

import { useCartStore, CartItem } from "@/store/cart.store";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const total = useCartStore((state) => state.totalAmount());
  const router = useRouter();

  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p>
          Browse our{" "}
          <a href="/products" className="text-blue-600 hover:underline">
            products
          </a>{" "}
          and add items to your cart.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {items.map((item: CartItem) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>
                Price: ₹{item.price} × Quantity: {item.quantity} = ₹
                {item.price * item.quantity}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">Total: ₹{total}</h3>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Clear Cart
          </button>
          <button
            onClick={() => router.push("/checkout")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

