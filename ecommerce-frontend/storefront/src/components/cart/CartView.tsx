"use client";

import CartItemCard from "./CartItem";
import { useCart } from "@/hooks/useCart";

export default function CartView() {
  const {
    cart,
    loading,
    remove,
    update,
  } = useCart();

  if (loading) {
    return (
      <div>
        Loading cart...
      </div>
    );
  }

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onRemove={remove}
          onUpdate={update}
        />
      ))}

      <div className="text-right mt-10">
        <h2 className="text-2xl font-bold">
          Total: ₹{total}
        </h2>
      </div>
    </div>
  );
}
