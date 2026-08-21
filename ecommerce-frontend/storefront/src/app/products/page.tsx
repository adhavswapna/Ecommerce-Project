"use client";

import { useSearchParams } from "next/navigation";

import ProductList from "@/components/product/ProductList";

export default function ProductsPage() {
  const params = useSearchParams();

  const search = params.get("search");
  const category = params.get("category");

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold md:text-4xl">
            {category
              ? `${category} Products`
              : search
              ? `Search results for "${search}"`
              : "All Products"}
          </h1>

          <p className="mt-2 text-gray-500">
            {category
              ? `Explore products in ${category}.`
              : "Explore thousands of products with fast delivery."}
          </p>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <ProductList category={category || undefined} />

        </div>

      </div>
    </main>
  );
}
