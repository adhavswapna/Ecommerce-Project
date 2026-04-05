"use client";

import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";

export default function ProductCard({ product }: any) {
  const {
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    getItemByProductId,
  } = useCartStore();

  const {
    addItem: addWishlist,
    removeItem: removeWishlist,
    isWishlisted,
    items,
  } = useWishlistStore();

  const cartItem = getItemByProductId(product.id);
  const wishItem = items.find((i) => i.productId === product.id);
  const liked = isWishlisted(product.id);

  const handleWishlist = async () => {
    if (liked && wishItem) {
      await removeWishlist(wishItem.id);
      toast("Removed from wishlist");
    } else {
      await addWishlist(product.id);
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h2>{product.name}</h2>
      <p>₹{product.price}</p>

      {/* ❤️ Wishlist */}
      <button onClick={handleWishlist}>
        {liked ? "❤️" : "🤍"}
      </button>

      {/* 🛒 Cart */}
      {!cartItem ? (
        <button onClick={() => addItem(product.id)}>
          Add to Cart
        </button>
      ) : (
        <div>
          <button onClick={() => decreaseQty(cartItem.id)}>-</button>
          {cartItem.quantity}
          <button onClick={() => increaseQty(cartItem.id)}>+</button>
          <button onClick={() => removeItem(cartItem.id)}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
