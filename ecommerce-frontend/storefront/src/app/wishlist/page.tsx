"use client";

import React, { useEffect, useState } from "react";
import WishlistItem from "@/components/wishlist/WishlistItems";
import WishlistContainer from "@/components/wishlist/WishlistContainer";

// We'll use localStorage for demo, or you can fetch from backend
export default function WishlistPage() {
  const [items, setItems] = useState<
    { id: string; name: string; price: number; productId: string }[]
  >([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setItems(wishlist);
  }, []);

  const handleRemove = (id: string) => {
    const newItems = items.filter((i) => i.id !== id);
    setItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  };

  return (
    <WishlistContainer>
      {items.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        items.map((item) => (
          <WishlistItem key={item.id} item={item} onRemove={handleRemove} />
        ))
      )}
    </WishlistContainer>
  );
}
