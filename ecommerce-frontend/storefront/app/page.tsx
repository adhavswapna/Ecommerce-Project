import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 2499,
    image: "https://images.unsplash.com/photo-1518441902112-f9fda6f6e6b3",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 3999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 1999,
    image: "https://images.unsplash.com/photo-1585386959984-a4155229a4f8",
  },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

