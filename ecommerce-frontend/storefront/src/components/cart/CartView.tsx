"use client";

import CartItemCard from "./CartItem";
import { useCart } from "@/hooks/useCart";

export default function CartView() {
  const { items, loading, removeItem, updateItem, total } =
    useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!items.length) {
    return (
      <div className="text-center text-gray-500 p-10">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onRemove={removeItem}
          onUpdate={updateItem}
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
