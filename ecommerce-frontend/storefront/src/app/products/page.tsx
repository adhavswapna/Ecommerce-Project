"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/productApi";
import { addToCart } from "@/lib/cartApi";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (product: Product) => {
    try {
      setAddingId(product.id);

      await addToCart(product.id, product.price, 1);

      alert("✅ Added to cart");
    } catch (err: any) {
      alert(err.message || "❌ Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="p-6">No products available</p>;
  }

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 hover:shadow transition"
          >
            {/* CLICKABLE AREA */}
            <Link href={`/products/${product.id}`}>
              <div className="cursor-pointer">
                <h2 className="text-lg font-semibold">
                  {product.name}
                </h2>

                <p className="text-gray-600">
                  ₹{product.price}
                </p>

                {product.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <p className="text-xs mt-2">
                  Stock:{" "}
                  <span
                    className={
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {product.stock}
                  </span>
                </p>
              </div>
            </Link>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={() => handleAddToCart(product)}
              disabled={addingId === product.id || product.stock === 0}
              className={`mt-4 w-full py-2 rounded text-white ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : addingId === product.id
                  ? "bg-gray-600"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {addingId === product.id
                ? "Adding..."
                : product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
