"use client";

import { CartItem } from "@/types/cart";

interface Props {
  item: CartItem;

  onRemove: (id: string) => void;

  onUpdate: (id: string, quantity: number) => void;
}

export default function CartItemCard({
  item,
  onRemove,
  onUpdate,
}: Props) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      {/* PRODUCT INFO */}
      <div>
        <h2 className="font-semibold">
          {item.product?.name || "Product"}
        </h2>

        <p className="text-sm text-gray-500">
          ID: {item.productId}
        </p>

        <p className="mt-2">
          Quantity: {item.quantity}
        </p>

        <p>Price: ₹{item.price}</p>

        <p className="font-bold">
          Subtotal: ₹{item.price * item.quantity}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() =>
            onUpdate(item.id, item.quantity - 1)
          }
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            onUpdate(item.id, item.quantity + 1)
          }
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>

        <button
          onClick={() => onRemove(item.id)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
