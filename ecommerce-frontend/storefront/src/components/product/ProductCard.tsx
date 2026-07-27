"use client";

import { useEffect } from "react";
import Link from "next/link";

import SafeImage from "@/components/ui/SafeImage";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({
  product,
}: Props) {
  const image =
    product.images?.[0]?.url?.trim() ||
    "/placeholder.png";

  useEffect(() => {
    console.group(
      `🛍️ Product: ${product.name}`
    );

    console.log("Product ID:", product.id);
    console.log("Product:", product);
    console.log("Images:", product.images);
    console.log("Selected Image:", image);

    console.groupEnd();
  }, [product, image]);

  const fakeRating = (
    4 + Math.random()
  ).toFixed(1);

  const discount =
    Math.floor(Math.random() * 30) + 10;

  const oldPrice = Math.round(
    product.price /
      (1 - discount / 100)
  );

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        transition-all
        duration-300
        hover:shadow-2xl
        group
      "
    >
      {/* Discount Badge */}
      <div
        className="
          absolute
          left-3
          top-3
          z-20
          rounded-full
          bg-red-600
          px-3
          py-1
          text-xs
          font-bold
          text-white
        "
      >
        {discount}% OFF
      </div>

      {/* Wishlist */}
      <button
        type="button"
        className="
          absolute
          right-3
          top-3
          z-20
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white
          shadow
          transition
          hover:scale-110
        "
      >
        ❤️
      </button>

      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
      >
        <div
          className="
            relative
            h-56
            overflow-hidden
            bg-gray-50
          "
        >
          <SafeImage
            src={image}
            alt={product.name}
            width={300}
            height={300}
            className="
              h-full
              w-full
              object-contain
              p-3
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        {/* Rating */}
        <div
          className="
            mb-2
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              rounded
              bg-green-700
              px-2
              py-1
              text-xs
              text-white
            "
          >
            ★ {fakeRating}
          </span>

          <span
            className="
              text-xs
              text-gray-500
            "
          >
            500+ ratings
          </span>
        </div>

        {/* Product Name */}
        <h2
          className="
            min-h-[56px]
            line-clamp-2
            text-lg
            font-semibold
          "
        >
          {product.name}
        </h2>

        {/* Description */}
        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            text-gray-500
          "
        >
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-4">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                text-2xl
                font-bold
              "
            >
              ₹{product.price}
            </span>

            <span
              className="
                text-gray-400
                line-through
              "
            >
              ₹{oldPrice}
            </span>
          </div>

          <p
            className="
              mt-1
              text-sm
              text-green-700
            "
          >
            Save ₹
            {oldPrice - product.price}
          </p>
        </div>

        {/* Stock */}
        <div className="mt-3">
          {product.stock > 0 ? (
            <span
              className="
                font-medium
                text-green-700
              "
            >
              ✓ In Stock
            </span>
          ) : (
            <span
              className="
                font-medium
                text-red-600
              "
            >
              Out of Stock
            </span>
          )}
        </div>

        {/* Delivery */}
        <p
          className="
            mt-2
            text-sm
            text-gray-600
          "
        >
          🚚 Free Delivery
        </p>

        {/* View Button */}
        <Link
          href={`/products/${product.id}`}
          className="
            mt-4
            block
            rounded-xl
            bg-yellow-400
            py-3
            text-center
            font-semibold
            transition
            hover:bg-yellow-500
          "
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
