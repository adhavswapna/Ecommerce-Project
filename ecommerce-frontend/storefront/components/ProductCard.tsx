"use client";

import { useCartStore } from "@/store/cart.store";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1 });
  };

  return (
    <div className="rounded-xl border bg-white shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-700 font-medium">₹{product.price}</p>
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-primary text-white py-2 rounded hover:bg-blue-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

