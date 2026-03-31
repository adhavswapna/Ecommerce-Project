"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <p className="p-6">Loading products...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!products.length) return <p className="p-6">No products found</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/* ================= PRODUCT CARD (NO IMAGE) ================= */

function ProductCard({ product }: any) {
  return (
    <div className="border rounded-lg p-3 shadow-sm flex flex-col hover:shadow-md transition">

      {/* PRODUCT INFO ONLY */}
      <h2 className="text-sm font-semibold line-clamp-1">
        {product.name}
      </h2>

      <p className="text-green-600 text-sm mt-1">
        ₹{product.price}
      </p>

      <p className="text-gray-500 text-xs mt-2 line-clamp-2">
        {product.description}
      </p>

      {/* BUTTON */}
      <Link
        href={`/products/${product.id}`}
        className="mt-3 px-3 py-1.5 text-sm bg-black text-white rounded text-center hover:bg-gray-800"
      >
        View Product
      </Link>
    </div>
  );
}
