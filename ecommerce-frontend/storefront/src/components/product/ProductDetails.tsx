"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Product } from "@/types/product";
import ProductImageSlider from "@/components/ui/ProductImageSlider";

interface Props {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductDetails({
  product,
  onAddToCart,
}: Props) {
  const router = useRouter();

  const [qty, setQty] = useState(1);

  const images =
    Array.isArray(product.images)
      ? product.images.map((img: any) =>
          typeof img === "string"
            ? { url: img }
            : img
        )
      : [];

  const rating = (
    4 +
    Math.random() * 1
  ).toFixed(1);

  const reviews =
    Math.floor(
      Math.random() * 5000
    ) + 100;

  const discount =
    Math.floor(
      Math.random() * 25
    ) + 10;

  const oldPrice =
    Math.round(
      product.price /
      (1 - discount / 100)
    );

  return (
    <div
      className="
      max-w-7xl
      mx-auto
      grid
      lg:grid-cols-[1.1fr_0.9fr]
      gap-8
      "
    >
      {/* LEFT */}

      <div
        className="
        bg-white
        rounded-2xl
        p-6
        shadow
        "
      >
        <ProductImageSlider
          images={images}
          name={product.name}
        />
      </div>

      {/* RIGHT */}

      <div
        className="
        bg-white
        rounded-2xl
        p-8
        shadow
        "
      >
        <p
          className="
          text-blue-600
          text-sm
          mb-2
          "
        >
          Brand: ShopSphere
        </p>

        <h1
          className="
          text-4xl
          font-bold
          "
        >
          {product.name}
        </h1>

        {/* Rating */}

        <div
          className="
          flex
          items-center
          gap-3
          mt-4
          "
        >
          <span
            className="
            bg-green-700
            text-white
            px-3
            py-1
            rounded
            "
          >
            ★ {rating}
          </span>

          <span
            className="
            text-gray-600
            "
          >
            {reviews} Ratings
          </span>
        </div>

        {/* Price */}

        <div className="mt-6">
          <div
            className="
            flex
            items-center
            gap-4
            "
          >
            <span
              className="
              text-5xl
              font-bold
              "
            >
              ₹{product.price}
            </span>

            <span
              className="
              line-through
              text-gray-400
              text-xl
              "
            >
              ₹{oldPrice}
            </span>

            <span
              className="
              text-green-700
              font-bold
              "
            >
              {discount}% OFF
            </span>
          </div>

          <p
            className="
            mt-2
            text-green-700
            "
          >
            Inclusive of all taxes
          </p>
        </div>

        {/* Offers */}

        <div
          className="
          mt-8
          border
          rounded-xl
          p-5
          bg-green-50
          "
        >
          <h3 className="font-bold">
            Available Offers
          </h3>

          <ul
            className="
            mt-3
            space-y-2
            text-sm
            "
          >
            <li>
              ✅ Bank Offer: 10% Instant Discount
            </li>

            <li>
              ✅ Free Delivery
            </li>

            <li>
              ✅ No Cost EMI Available
            </li>

            <li>
              ✅ Easy Returns
            </li>
          </ul>
        </div>

        {/* Description */}

        <div className="mt-8">
          <h3
            className="
            font-bold
            text-xl
            mb-3
            "
          >
            Description
          </h3>

          <p
            className="
            text-gray-600
            leading-7
            "
          >
            {product.description ||
              "Premium quality product built for durability and performance."}
          </p>
        </div>

        {/* Stock */}

        <div className="mt-6">
          {product.stock > 0 ? (
            <span
              className="
              bg-green-100
              text-green-700
              px-4
              py-2
              rounded-full
              font-semibold
              "
            >
              In Stock ({product.stock})
            </span>
          ) : (
            <span
              className="
              bg-red-100
              text-red-700
              px-4
              py-2
              rounded-full
              "
            >
              Out Of Stock
            </span>
          )}
        </div>

        {/* Quantity */}

        <div
          className="
          flex
          items-center
          gap-4
          mt-8
          "
        >
          <button
            onClick={() =>
              setQty(
                Math.max(
                  1,
                  qty - 1
                )
              )
            }
            className="
            h-12
            w-12
            border
            rounded-lg
            "
          >
            -
          </button>

          <span
            className="
            text-2xl
            font-bold
            "
          >
            {qty}
          </span>

          <button
            onClick={() =>
              setQty(qty + 1)
            }
            className="
            h-12
            w-12
            border
            rounded-lg
            "
          >
            +
          </button>
        </div>

        {/* Buttons */}

        <div
          className="
          mt-8
          grid
          grid-cols-2
          gap-4
          "
        >
          <button
            onClick={onAddToCart}
            className="
            bg-yellow-400
            hover:bg-yellow-500
            py-4
            rounded-xl
            font-bold
            "
          >
            Add To Cart
          </button>

          <button
            onClick={() => {
              onAddToCart?.();
              router.push(
                "/checkout"
              );
            }}
            className="
            bg-orange-500
            hover:bg-orange-600
            text-white
            py-4
            rounded-xl
            font-bold
            "
          >
            Buy Now
          </button>
        </div>

        {/* Seller */}

        <div
          className="
          mt-10
          border-t
          pt-6
          "
        >
          <h3 className="font-bold">
            Seller Information
          </h3>

          <p className="mt-2">
            ShopSphere Official Seller
          </p>

          <p
            className="
            text-sm
            text-gray-500
            "
          >
            100% Genuine Products
          </p>
        </div>
      </div>
    </div>
  );
}
