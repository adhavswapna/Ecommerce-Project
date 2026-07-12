"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    fetchCart,
    updateItem,
    removeItem,
    cartTotal,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <main
      className="
      max-w-7xl
      mx-auto
      p-6
      "
    >
      <h1
        className="
        text-3xl
        font-bold
        mb-8
        "
      >
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div
          className="
          bg-white
          border
          rounded-2xl
          p-10
          text-center
          "
        >
          <h2
            className="
            text-xl
            font-bold
            "
          >
            Your cart is empty
          </h2>

          <button
            onClick={() =>
              router.push("/products")
            }
            className="
            mt-5
            bg-yellow-400
            px-8
            py-3
            rounded-full
            font-bold
            "
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div
          className="
          grid
          lg:grid-cols-3
          gap-8
          "
        >
          {/* ITEMS */}

          <div
            className="
            lg:col-span-2
            space-y-5
            "
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="
                bg-white
                border
                rounded-2xl
                p-5
                flex
                justify-between
                items-center
                shadow-sm
                "
              >
                <div>
                  <h2
                    className="
                    font-bold
                    text-lg
                    "
                  >
                    {item.product?.name ||
                      "Product"}
                  </h2>

                  <p
                    className="
                    text-gray-500
                    "
                  >
                    ID: {item.productId}
                  </p>

                  <p
                    className="
                    text-xl
                    font-bold
                    mt-2
                    "
                  >
                    ₹{item.price}
                  </p>
                </div>

                <div
                  className="
                  text-right
                  "
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    "
                  >
                    <input
                      type="number"
                      min={1}
                      value={
                        item.quantity
                      }
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="
                      border
                      rounded
                      w-20
                      p-2
                      "
                    />

                    <button
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      className="
                      text-red-600
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}

          <div
            className="
            bg-white
            border
            rounded-2xl
            p-6
            h-fit
            shadow
            "
          >
            <h2
              className="
              text-xl
              font-bold
              "
            >
              Order Summary
            </h2>

            <div
              className="
              flex
              justify-between
              mt-5
              "
            >
              <span>
                Items
              </span>

              <span>
                {items.length}
              </span>
            </div>

            <div
              className="
              border-t
              mt-5
              pt-5
              flex
              justify-between
              text-2xl
              font-bold
              "
            >
              Total

              <span>
                ₹{cartTotal()}
              </span>
            </div>

            <button
              onClick={() =>
                router.push(
                  "/checkout"
                )
              }
              className="
              w-full
              mt-6
              bg-yellow-400
              hover:bg-yellow-500
              py-3
              rounded-full
              font-bold
              "
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
