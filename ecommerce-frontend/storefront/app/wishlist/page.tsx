"use client";

import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import Link from "next/link";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const clearWishlist = useWishlistStore(
    (state) => state.clearWishlist
  );

  const addItem = useCartStore((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <Link href="/" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border p-4 mb-4 rounded"
        >
          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addItem(item)}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Move to Cart
            </button>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={clearWishlist}
        className="mt-6 bg-gray-300 px-4 py-2 rounded"
      >
        Clear Wishlist
      </button>
    </div>
  );
}

