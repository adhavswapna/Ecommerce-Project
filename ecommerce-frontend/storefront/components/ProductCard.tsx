"use client";

import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  // ✅ Hooks must be at top level
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />

      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-gray-700">₹{product.price}</p>

      {/* 🛒 Add to Cart */}
      <button
        onClick={() => addItem(product)}
        className="mt-4 w-full bg-black text-white py-2 rounded"
      >
        Add to Cart
      </button>

      {/* ❤️ Add to Wishlist */}
      <button
        onClick={() => addToWishlist(product)}
        className="mt-2 w-full border py-2 rounded hover:bg-gray-100"
      >
        ❤️ Add to Wishlist
      </button>
    </div>
  );
}

