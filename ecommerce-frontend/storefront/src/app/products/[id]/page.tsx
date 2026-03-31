"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/api/products";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!id) return;
    getProductById(id as string).then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  // 🔥 STATIC IMAGES (NO BACKEND DEPENDENCY)
  const images = [
    "/headphones.jpg",
    "/smartphone.jpg",
    "/speaker.jpg",
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* MAIN IMAGE */}
      <img
        src={images[selected]}
        alt="Product"
        className="w-full h-80 object-cover rounded-lg"
      />

      {/* THUMBNAILS */}
      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setSelected(i)}
            className={`w-16 h-16 cursor-pointer rounded border ${
              i === selected ? "border-black" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* PRODUCT INFO */}
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-green-600 text-lg">₹{product.price}</p>

      {/* ADD TO CART */}
      <button
        onClick={() => addItem(product.id)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
