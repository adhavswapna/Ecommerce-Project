"use client";

import {
  useEffect,
} from "react";

import {
  useParams,
} from "next/navigation";

import ProductDetails from "@/components/product/ProductDetails";

import {
  useProducts,
} from "@/hooks/useProducts";

export default function ProductPage() {
  const params =
    useParams();

  const {
    product,
    loading,
    fetchProduct,
  } =
    useProducts();

  useEffect(() => {
    if (params?.id) {
      fetchProduct(
        params.id as string
      );
    }
  }, [params?.id]);

  if (
    loading ||
    !product
  ) {
    return (
      <div className="p-10">
        Loading product...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-10">
      <ProductDetails
        product={product}
      />
    </main>
  );
}
