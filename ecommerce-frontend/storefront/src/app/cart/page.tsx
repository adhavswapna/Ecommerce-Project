// src/app/cart/page.tsx

"use client";

import { useEffect } from "react";

import Link from "next/link";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const {
    cartItems,
    loading,
    fetchCart,
    updateItem,
    removeItem,
    clear,
    cartTotal,
  } = useCartStore();

  const totalPrice =
    cartTotal();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Shopping Cart
        </h1>

        {cartItems.length > 0 && (
          <button
            onClick={clear}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition"
          >
            Clear Cart
          </button>
        )}

      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="bg-gray-100 rounded-2xl p-12 text-center">

          <h2 className="text-2xl font-semibold mb-3">
            Your cart is empty 🛒
          </h2>

          <p className="text-gray-600">
            Add some products to your cart.
          </p>

        </div>
      ) : (
        <div className="space-y-6">

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >

              {/* Product Details */}
              <div className="space-y-2">

                <h2 className="text-2xl font-semibold">
                  {item.product?.name ||
                    item.productId}
                </h2>

                <p className="text-gray-600 text-lg">
                  Price: ₹
                  {item.price}
                </p>

                <p className="text-gray-600 text-lg">
                  Quantity:
                  {" "}
                  {item.quantity}
                </p>

                <p className="font-bold text-xl mt-2">
                  Total: ₹
                  {item.price *
                    item.quantity}
                </p>

              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">

                {/* Increase */}
                <button
                  onClick={() =>
                    updateItem(
                      item.id,
                      item.quantity + 1
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-lg transition"
                >
                  +
                </button>

                {/* Decrease */}
                <button
                  onClick={() => {
                    if (
                      item.quantity > 1
                    ) {
                      updateItem(
                        item.id,
                        item.quantity - 1
                      );
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl text-lg transition"
                >
                  -
                </button>

                {/* Remove */}
                <button
                  onClick={() =>
                    removeItem(
                      item.id
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition"
                >
                  Remove
                </button>

              </div>
            </div>
          ))}

          {/* Total Section */}
          <div className="bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">

            <div>

              <h2 className="text-3xl font-bold">
                Grand Total
              </h2>

              <p className="text-gray-300 mt-2">
                Total items:
                {" "}
                {cartItems.length}
              </p>

            </div>

            <div className="text-4xl font-bold">
              ₹{totalPrice}
            </div>

          </div>

          {/* Checkout */}
          <div className="flex justify-end">

            <Link
              href="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold transition"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>
      )}
    </div>
  );
}
