"use client";

import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function ProductList() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="p-10">
        Loading products...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
