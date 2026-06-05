// src/app/wishlist/page.tsx

"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
} from "lucide-react";

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

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const [addingId, setAddingId] =
    useState<string | null>(null);

  const [removingId, setRemovingId] =
    useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /**
   * 🛒 ADD TO CART
   */
  const handleAddToCart = async (
    productId: string,
    price?: number
  ) => {
    try {
      setAddingId(productId);

      await addItem(
        productId,
        1,
        price || 0
      );

      toast.success(
        "Added to cart"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to add to cart"
      );
    } finally {
      setAddingId(null);
    }
  };

  /**
   * ❌ REMOVE ITEM
   */
  const handleRemove = async (
    productId: string
  ) => {
    try {
      setRemovingId(productId);

      await removeItem(productId);

      toast.success(
        "Removed from wishlist"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to remove item"
      );
    } finally {
      setRemovingId(null);
    }
  };

  /**
   * 🧹 CLEAR WISHLIST
   */
  const handleClearWishlist =
    async () => {
      try {
        await clearAll();

        toast.success(
          "Wishlist cleared"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to clear wishlist"
        );
      }
    };

  /**
   * ⏳ LOADING
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />

          <p className="text-lg font-medium">
            Loading wishlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Heart className="w-9 h-9" />
            Wishlist
          </h1>

          <p className="text-gray-500 mt-2">
            Your saved products
          </p>
        </div>

        <div className="flex items-center gap-4">

          <Link
            href="/products"
            className="text-blue-600 hover:underline"
          >
            Continue Shopping
          </Link>

          {wishlist.length > 0 && (
            <button
              onClick={
                handleClearWishlist
              }
              className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-5 py-2 rounded-xl"
            >
              Clear Wishlist
            </button>
          )}

        </div>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">

          <Heart className="w-16 h-16 mx-auto text-gray-300" />

          <h2 className="text-2xl font-semibold mt-6">
            Wishlist is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Save products to view them later
          </p>

          <Link
            href="/products"
            className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
          >
            Browse Products
          </Link>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {wishlist.map((item) => {
            const product =
              item.product;

            const price =
              product?.discountedPrice ||
              product?.price ||
              0;

            return (
              <div
                key={item.id}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >

                {/* IMAGE */}
                <div className="relative w-full h-64 bg-gray-100">

                  <Image
                    src={
                      product?.image ||
                      "/placeholder.png"
                    }
                    alt={
                      product?.name ||
                      "Product"
                    }
                    fill
                    className="object-cover"
                  />

                </div>

                {/* BODY */}
                <div className="p-5">

                  <h2 className="text-xl font-semibold line-clamp-1">
                    {product?.name ||
                      item.productId}
                  </h2>

                  <p className="text-2xl font-bold mt-3">
                    ₹{price}
                  </p>

                  {product?.stock !==
                    undefined && (
                    <p className="mt-2 text-sm text-gray-500">
                      Stock:{" "}
                      {product.stock}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        handleAddToCart(
                          item.productId,
                          price
                        )
                      }
                      disabled={
                        addingId ===
                        item.productId
                      }
                      className="flex-1 bg-black text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                      {addingId ===
                      item.productId ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleRemove(
                          item.productId
                        )
                      }
                      disabled={
                        removingId ===
                        item.productId
                      }
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-4 rounded-xl disabled:opacity-50"
                    >
                      {removingId ===
                      item.productId ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
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
