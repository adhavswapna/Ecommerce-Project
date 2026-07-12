"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductDetails from "@/components/product/ProductDetails";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const {
    product,
    loadingProduct,
    fetchProduct,
    clearProduct,
  } = useProductStore();

  const { addItem } = useCartStore();

  useEffect(() => {
    if (typeof params?.id === "string") {
      fetchProduct(params.id);
    }

    return () => {
      clearProduct();
    };
  }, [params?.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    await addItem(product.id, 1, product.price);
    router.push("/cart");
  };

  if (loadingProduct || !product) {
    return <div className="p-10">Loading product...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <ProductDetails
        product={product}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
