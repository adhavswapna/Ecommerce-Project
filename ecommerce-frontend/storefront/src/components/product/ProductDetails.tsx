// src/components/product/ProductDetails.tsx

"use client";

import {
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import toast from "react-hot-toast";

import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useCartStore,
} from "@/store/cartStore";

import {
  useWishlistStore,
} from "@/store/wishlistStore";

import {
  useAuthStore,
} from "@/store/auth.store";

interface ProductDetailsProps {
  product: {
    id: string;

    name: string;

    description?: string;

    price: number;

    discountedPrice?: number;

    stock: number;

    image?: string;

    category?: string;

    brand?: string;

    rating?: number;

    totalReviews?: number;
  };
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const router =
    useRouter();

  /* =========================================
   * 🧠 AUTH
   * ========================================= */
  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  /* =========================================
   * 🛒 CART
   * ========================================= */
  const {
    addItem,
    loading,
  } = useCartStore();

  /* =========================================
   * ❤️ WISHLIST
   * ========================================= */
  const {
    addToWishlist,
    loading:
      wishlistLoading,
  } = useWishlistStore();

  /* =========================================
   * 🔢 STATES
   * ========================================= */
  const [quantity,
    setQuantity] =
    useState(1);

  const [addingCart,
    setAddingCart] =
    useState(false);

  const [addingWishlist,
    setAddingWishlist] =
    useState(false);

  /* =========================================
   * 💰 FINAL PRICE
   * ========================================= */
  const finalPrice =
    useMemo(() => {
      return (
        product.discountedPrice ||
        product.price
      );
    }, [product]);

  /* =========================================
   * 💸 DISCOUNT %
   * ========================================= */
  const discountPercentage =
    useMemo(() => {
      if (
        !product.discountedPrice
      ) {
        return 0;
      }

      return Math.round(
        ((product.price -
          product.discountedPrice) /
          product.price) *
          100
      );
    }, [product]);

  /* =========================================
   * ➕ QUANTITY
   * ========================================= */
  const increaseQty =
    () => {
      if (
        quantity <
        product.stock
      ) {
        setQuantity(
          (prev) =>
            prev + 1
        );
      }
    };

  const decreaseQty =
    () => {
      if (quantity > 1) {
        setQuantity(
          (prev) =>
            prev - 1
        );
      }
    };

  /* =========================================
   * 🔐 AUTH CHECK
   * ========================================= */
  const requireLogin =
    (): boolean => {
      if (
        !isAuthenticated
      ) {
        toast.error(
          "Please login first"
        );

        router.push(
          "/login"
        );

        return false;
      }

      return true;
    };

  /* =========================================
   * 🛒 ADD TO CART
   * ========================================= */
  /* =========================================
 * 🛒 ADD TO CART
 * ========================================= */
const handleAddToCart =
  async () => {
    try {
      if (
        !requireLogin()
      ) {
        return;
      }

      setAddingCart(
        true
      );

      await addItem(
        product.id,
        quantity,
        finalPrice
      );

      toast.success(
        "Added to cart successfully"
      );

      /**
       * 🚀 Redirect user to cart
       */
      router.push(
        "/cart"
      );

    } catch (
      error
    ) {
      console.error(
        "Cart error:",
        error
      );

      toast.error(
        "Failed to add to cart"
      );
    } finally {
      setAddingCart(
        false
      );
    }
  };

  /* =========================================
   * ❤️ ADD TO WISHLIST
   * ========================================= */
  const handleWishlist =
    async () => {
      try {
        if (
          !requireLogin()
        ) {
          return;
        }

        setAddingWishlist(
          true
        );

        await addToWishlist(
          product.id
        );

        toast.success(
          "Added to wishlist"
        );
      } catch (
        error
      ) {
        console.error(
          "Wishlist error:",
          error
        );

        toast.error(
          "Failed to add wishlist"
        );
      } finally {
        setAddingWishlist(
          false
        );
      }
    };

  return (
    <div className="grid lg:grid-cols-2 gap-10">

      {/* =========================================
       * 🖼️ PRODUCT IMAGE
       * ========================================= */}
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">

        <div className="relative aspect-square bg-gray-100">

          {product.image ? (
            <Image
              src={
                product.image
              }
              alt={
                product.name
              }
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
              No Image
            </div>
          )}

          {/* DISCOUNT */}
          {discountPercentage >
            0 && (
            <div className="absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
              {discountPercentage}
              % OFF
            </div>
          )}
        </div>
      </div>

      {/* =========================================
       * 📦 PRODUCT DETAILS
       * ========================================= */}
      <div className="bg-white border rounded-3xl shadow-sm p-8">

        {/* CATEGORY */}
        {product.category && (
          <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
            {
              product.category
            }
          </p>
        )}

        {/* TITLE */}
        <h1 className="text-4xl font-bold mt-2 leading-tight">
          {product.name}
        </h1>

        {/* BRAND */}
        {product.brand && (
          <p className="mt-3 text-gray-600">
            Brand:
            <span className="font-medium ml-2">
              {
                product.brand
              }
            </span>
          </p>
        )}

        {/* RATING */}
        <div className="flex items-center gap-3 mt-5">

          <div className="flex items-center gap-1 text-yellow-500">

            <Star className="w-5 h-5 fill-yellow-500" />

            <span className="font-semibold">
              {product.rating ||
                4.5}
            </span>

          </div>

          <span className="text-gray-500 text-sm">
            (
            {product.totalReviews ||
              0}{" "}
            reviews)
          </span>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-8">

          <h2 className="text-xl font-semibold">
            Description
          </h2>

          <p className="text-gray-600 mt-3 leading-relaxed">
            {product.description ||
              "No description available for this product."}
          </p>
        </div>

        {/* PRICE */}
        <div className="mt-10">

          {product.discountedPrice ? (
            <div className="flex items-center gap-4 flex-wrap">

              <span className="text-5xl font-bold">
                ₹
                {
                  product.discountedPrice
                }
              </span>

              <span className="text-2xl text-gray-400 line-through">
                ₹
                {
                  product.price
                }
              </span>

            </div>
          ) : (
            <span className="text-5xl font-bold">
              ₹{product.price}
            </span>
          )}

        </div>

        {/* STOCK */}
        <div className="mt-6">

          {product.stock > 0 ? (
            <span className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              In Stock (
              {product.stock}
              )
            </span>
          ) : (
            <span className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
              Out Of Stock
            </span>
          )}

        </div>

        {/* QUANTITY */}
        {product.stock >
          0 && (
          <div className="mt-10">

            <h3 className="font-semibold text-lg">
              Quantity
            </h3>

            <div className="flex items-center gap-4 mt-4">

              <button
                onClick={
                  decreaseQty
                }
                className="w-11 h-11 border rounded-xl text-xl font-bold hover:bg-gray-100 transition"
              >
                -
              </button>

              <span className="text-xl font-semibold min-w-[30px] text-center">
                {quantity}
              </span>

              <button
                onClick={
                  increaseQty
                }
                className="w-11 h-11 border rounded-xl text-xl font-bold hover:bg-gray-100 transition"
              >
                +
              </button>

            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">

          {/* ADD TO CART */}
          <button
            disabled={
              addingCart ||
              loading ||
              product.stock <=
                0
            }
            onClick={
              handleAddToCart
            }
            className="flex-1 bg-black text-white py-4 rounded-2xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium"
          >

            <ShoppingCart className="w-5 h-5" />

            {addingCart
              ? "Adding..."
              : product.stock <=
                0
              ? "Out Of Stock"
              : "Add To Cart"}

          </button>

          {/* WISHLIST */}
          <button
            onClick={
              handleWishlist
            }
            disabled={
              addingWishlist ||
              wishlistLoading
            }
            className="px-6 py-4 border rounded-2xl hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >

            <Heart className="w-5 h-5" />

            {addingWishlist
              ? "Adding..."
              : "Wishlist"}

          </button>
        </div>
      </div>
    </div>
  );
}
