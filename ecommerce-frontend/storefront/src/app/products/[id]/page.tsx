"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/api/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ FIX: use correct function names
  const { addToCart } = useCart();
  const { addItem: addToWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // 📦 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="p-6">Loading product...</p>;
  }

  // 🛒 HANDLE ADD TO CART
  const handleAddToCart = async () => {
    try {
      setLoading(true);

      await addToCart(product.id, quantity);

      toast.success("Added to cart 🛒");

      // 🔥 redirect to cart
      router.push("/cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❤️ HANDLE WISHLIST
  const handleWishlist = async () => {
    try {
      await addToWishlist(product.id);
      toast.success("Added to wishlist ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 p-6">

      {/* 🖼️ PRODUCT IMAGE */}
      <div>
        <img
          src="https://via.placeholder.com/400"
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl border"
        />
      </div>

      {/* 📦 DETAILS */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-gray-500 mt-2">
          {product.description || "No description available"}
        </p>

        <p className="text-2xl font-semibold mt-4">
          ₹{product.price}
        </p>

        {/* 🔢 QUANTITY */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            -
          </button>

          <span className="text-lg">{quantity}</span>

          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>

        {/* 🛒 ADD TO CART */}
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        {/* ❤️ WISHLIST */}
        <button
          onClick={handleWishlist}
          className="mt-3 w-full border py-3 rounded-lg hover:bg-gray-100"
        >
          Add to Wishlist ❤️
        </button>
      </div>
    </div>
  );
}
