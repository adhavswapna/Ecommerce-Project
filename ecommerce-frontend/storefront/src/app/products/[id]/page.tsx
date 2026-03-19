"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/lib/productApi";
import { addToCart } from "@/lib/cartApi";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ================= FETCH PRODUCT ================= */
  const fetchProduct = async () => {
    try {
      if (!id) return;

      setLoading(true);
      setError("");

      const data = await getProductById(id);
      setProduct(data);
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!product) return;

    // ✅ Prevent useless API call
    if (product.stock === 0) {
      setMessage("❌ Product is out of stock");
      return;
    }

    try {
      setAdding(true);
      setMessage("");

      await addToCart(product.id, product.price, 1);

      setMessage("✅ Added to cart");

      // ✅ Better UX → instant navigation
      router.push("/cart");
    } catch (err: any) {
      if (err.message?.includes("not logged in")) {
        router.push("/login");
        return;
      }

      setMessage(err.message || "❌ Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <p className="p-6">Loading product...</p>;

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProduct}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  if (!product) return <p className="p-6">Product not found</p>;

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <p className="text-2xl text-green-600 mt-2">
        ₹{product.price}
      </p>

      {product.description && (
        <p className="mt-4 text-gray-700">{product.description}</p>
      )}

      <p className="mt-4 text-sm">
        Stock Available:{" "}
        <span
          className={
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }
        >
          {product.stock > 0 ? product.stock : "Out of stock"}
        </span>
      </p>

      <button
        onClick={handleAddToCart}
        disabled={adding || product.stock === 0}
        className={`mt-6 px-5 py-2 rounded text-white transition ${
          product.stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : adding
            ? "bg-gray-600"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <p className="mt-4 text-sm font-medium">{message}</p>
      )}
    </div>
  );
}
