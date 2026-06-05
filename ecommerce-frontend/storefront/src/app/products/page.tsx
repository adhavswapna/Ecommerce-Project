import ProductList from "@/components/product/ProductList";

export default function ProductsPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Products
      </h1>

      <ProductList />
    </main>
  );
}
