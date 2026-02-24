"use client";

import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/hooks/useAuth";

const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 2499,
    image: "http://localhost:3000/headphones.jpg",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 3999,
    image: "http://localhost:3000/watch.jpg",
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 1999,
    image: "http://localhost:3000/speaker.jpg",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* 👋 Greeting */}
      <div className="mb-6">
        {user ? (
          <h1 className="text-2xl font-semibold">
            Hi, {user.name} 👋
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold">
            Welcome to MyStorefront
          </h1>
        )}
      </div>

      {/* 🛍 Featured Products */}
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

