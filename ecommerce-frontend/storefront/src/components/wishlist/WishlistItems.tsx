"use client";

import React from "react";
import { addToCart } from "@/api/cart";

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    productId: string;
  };
  onRemove: (id: string) => void;
}

export default function WishlistItem({ item, onRemove }: WishlistItemProps) {
  const handleAddToCart = async () => {
    try {
      // You can replace userId with actual logged-in user ID
      const userId = localStorage.getItem("userId") || "";
      await addToCart(userId, item.productId, item.price, 1);
      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p>${item.price}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add to Cart
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
