"use client";

import WishlistItemCard from "./WishlistItem";

import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistContainer() {
  const {
    wishlist,
    loading,
    remove,
    moveToCart,
  } = useWishlist();

  if (loading) {
    return (
      <div>
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wishlist.map((item) => (
        <WishlistItemCard
          key={item.id}
          item={item}
          onRemove={remove}
          onMove={moveToCart}
        />
      ))}
    </div>
  );
}
