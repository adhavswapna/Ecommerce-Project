"use client";

import Link from "next/link";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
        <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-400">
            No Image
          </span>
        </div>

        <h2 className="text-lg font-semibold">
          {product.name}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-xl">
            ₹{product.price}
          </span>

          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
      </div>
    </Link>
  );
}
