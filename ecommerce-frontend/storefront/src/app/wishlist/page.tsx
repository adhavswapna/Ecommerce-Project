"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";

import { useWishlist } from "@/hooks/useWishlist";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const {
    wishlist,
    loading,
    fetchWishlist,
    removeItem,
    clearAll,
  } = useWishlist();

  const addItem = useCartStore((state) => state.addItem);

  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = async (productId: string, price?: number) => {
    try {
      setAddingId(productId);
      await addItem(productId, 1, price || 0);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);
      await removeItem(productId);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearAll();
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error("Failed to clear wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="ml-3">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Heart />
            Wishlist
          </h1>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="border border-red-500 text-red-500 px-5 py-2 rounded-xl"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {/* EMPTY */}
      {wishlist.length === 0 ? (
        <div className="text-center p-10 border rounded-xl">
          Wishlist is empty
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {wishlist.map((item) => {
            const product = item.product;

            // ✅ FIXED IMAGE LOGIC
            const imageUrl =
              product?.images?.[0]?.url || "/placeholder.png";

            const price = product?.price || 0;

            return (
              <div
                key={item.id}
                className="border rounded-2xl overflow-hidden shadow-sm"
              >

                {/* IMAGE FIXED */}
                <div className="relative w-full h-64 bg-gray-100">

                  <Image
                    src={imageUrl}
                    alt={product?.name || "Product"}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                    unoptimized
                  />

                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h2 className="font-semibold text-lg">
                    {product?.name}
                  </h2>

                  <p className="text-xl font-bold mt-2">
                    ₹{price}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {product?.stock}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        handleAddToCart(item.productId, price)
                      }
                      className="flex-1 bg-black text-white py-2 rounded-xl"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() =>
                        handleRemove(item.productId)
                      }
                      className="border border-red-500 text-red-500 px-4 rounded-xl"
                    >
                      <Trash2 />
                    </button>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}

    </main>
  );
}
