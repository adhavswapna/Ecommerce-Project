"use client";

import { CartItem } from "@/types/cart";

interface Props {
  item: CartItem;
}

export default function CheckoutItem({
  item,
}: Props) {
  return (
    <div className="border rounded-xl p-4 flex justify-between">
      <div>
        <h2 className="font-semibold">
          Product ID
        </h2>

        <p>{item.productId}</p>
      </div>

      <div>
        <p>
          Qty: {item.quantity}
        </p>

        <p>
          ₹{item.price}
        </p>
      </div>
    </div>
  );
}
