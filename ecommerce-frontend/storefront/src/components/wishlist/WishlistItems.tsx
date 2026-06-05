"use client";

import { WishlistItem } from "@/types/wishlist";

interface Props {
  item: WishlistItem;

  onRemove: (
    id: string
  ) => void;

  onMove: (
    id: string
  ) => void;
}

export default function WishlistItemCard({
  item,
  onRemove,
  onMove,
}: Props) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <h2 className="font-semibold">
          Product ID
        </h2>

        <p>{item.productId}</p>

        <p className="mt-2">
          Quantity: {item.quantity}
        </p>

        <p>
          Price: ₹{item.price}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() =>
            onMove(item.id)
          }
          className="bg-black text-white px-4 py-2 rounded"
        >
          Move To Cart
        </button>

        <button
          onClick={() =>
            onRemove(item.id)
          }
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
