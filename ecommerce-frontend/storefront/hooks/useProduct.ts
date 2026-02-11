import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { fetcher } from "@/utils/fetcher";

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_PRODUCT_API_URL}/products`
        );
        if (!data?.length) throw new Error("No products from backend");
        setProducts(data);
      } catch (err) {
        console.warn("Backend not available, using fallback products");
        // fallback dummy products
        setProducts([
          { id: "1", name: "Sample Product 1", price: 499 },
          { id: "2", name: "Sample Product 2", price: 799 },
          { id: "3", name: "Sample Product 3", price: 1299 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return { products, loading };
}

