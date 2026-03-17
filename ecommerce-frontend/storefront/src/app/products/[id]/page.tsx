"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/lib/productApi";
import { addToCart } from "@/lib/cartApi";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const data = await getProductById(id as string);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      setMessage("");

      await addToCart(product.id, product.price, 1);

      setMessage("✅ Added to cart");

      // optional: redirect to cart after 1 sec
      setTimeout(() => {
        router.push("/cart");
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || "❌ Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <p className="p-6">Loading product...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
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
