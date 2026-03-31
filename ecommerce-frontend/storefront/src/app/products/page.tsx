// src/app/products/page.tsx
import ProductList from "@/components/product/ProductList";

export default function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <ProductList />
    </div>
  );
}
