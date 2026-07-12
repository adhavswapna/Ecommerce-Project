"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/auth.store";

import {
  createCheckoutOrder,
  confirmOrder,
} from "@/api/checkout";

import {
  createPayment,
} from "@/api/payments";

export default function CheckoutPage() {
  const router = useRouter();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const {
    items,
    cartTotal,
    clear,
    address,
    setAddress,
  } = useCartStore();

  const [loading, setLoading] =
    useState(false);

  const placing =
    useRef(false);

  const updateAddress = (
    field: string,
    value: string
  ) => {
    setAddress({
      ...address,
      [field]: value,
    });
  };

  const placeOrder =
    async () => {
      if (placing.current) {
        return;
      }

      placing.current = true;

      setLoading(true);

      try {
        if (!user?.id) {
          toast.error(
            "Please login first"
          );

          router.push("/login");

          return;
        }

        if (!items.length) {
          toast.error(
            "Cart is empty"
          );

          return;
        }

        if (
          !address.addressLine1 ||
          !address.city ||
          !address.phone
        ) {
          toast.error(
            "Please fill delivery address"
          );

          return;
        }

        const order =
          await createCheckoutOrder({
            userId: user.id,

            totalAmount:
              cartTotal(),

            paymentMethod:
              "COD",

            currency:
              "INR",

            address,

            items:
              items.map(
                (item) => ({
                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                  price:
                    item.price,
                })
              ),
          });

        const orderId =
          order?.id ||
          order?.orderId;

        if (!orderId) {
          throw new Error(
            "Order creation failed"
          );
        }

        await createPayment({
          userId: user.id,

          orderId,

          amount:
            cartTotal(),

          provider:
            "COD",

          currency:
            "INR",
        });

        await confirmOrder(
          orderId
        );

        await clear();

        toast.success(
          "Order placed successfully"
        );

        router.push(
          `/orders/${orderId}`
        );
      } catch (error: any) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Checkout failed"
        );
      } finally {
        placing.current = false;

        setLoading(false);
      }
    };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-5">
            Delivery Address
          </h2>

          {[
            "addressLine1",
            "city",
            "state",
            "pincode",
            "phone",
          ].map((field) => (
            <input
              key={field}
              value={
                (address as any)[
                  field
                ]
              }
              placeholder={field}
              onChange={(e) =>
                updateAddress(
                  field,
                  e.target.value
                )
              }
              className="border p-3 rounded-xl w-full mb-3"
            />
          ))}
        </div>

        <div className="bg-white border rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-xl">
            Summary
          </h2>

          <div className="mt-5 flex justify-between">
            <span>
              Items
            </span>

            <span>
              {items.length}
            </span>
          </div>

          <div className="mt-5 border-t pt-5 flex justify-between text-2xl font-bold">
            <span>
              Total
            </span>

            <span>
              ₹{cartTotal()}
            </span>
          </div>

          <button
            disabled={loading}
            onClick={
              placeOrder
            }
            className="
            mt-6
            w-full
            bg-yellow-400
            hover:bg-yellow-500
            py-3
            rounded-full
            font-bold
            disabled:opacity-50
            "
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
