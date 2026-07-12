"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "@/components/product/ProductList";

export default function ProductsPage() {
  const params = useSearchParams();

  const search = params.get("search");

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {search
              ? `Search results for "${search}"`
              : "All Products"}
          </h1>

          <p className="text-gray-500 mt-2">
            Explore thousands of products with fast delivery.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <ProductList />
        </div>

      </div>
    </main>
  );
}
