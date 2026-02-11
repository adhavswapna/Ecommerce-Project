import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { fetcher } from "@/utils/fetcher";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_PRODUCT_API_URL}/products/${params.slug}`
      );
      setProduct(data);
    }
    loadProduct();
  }, [params.slug]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-green-700 text-xl font-semibold">₹{product.price}</p>
      <p>Rating: {product.rating || 0} ⭐</p>
      <button
        onClick={() => addItem({ productId: product.id, quantity: 1 })}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
}

