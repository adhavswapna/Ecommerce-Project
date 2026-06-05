"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";

import CheckoutItem from "./CheckoutItem";

export default function CheckoutContainer() {
  const router = useRouter();

  const { cart } = useCart();

  const {
    placeOrder,
    loading,
  } = useOrders();

  const total =
    cart.reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );

  const handleCheckout =
    async () => {
      try {
        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "{}"
          );

        const order =
          await placeOrder({
            userId:
              user.id,

            totalAmount:
              total,

            currency:
              "INR",

            paymentMethod:
              "COD",

            address: {
              addressLine1:
                "Shantiniketan CHSL",

              addressLine2:
                "Flat-204",

              city:
                "Kharghar",

              state:
                "Maharashtra",

              country:
                "India",

              pincode:
                "410210",

              phone:
                "9999999999",
            },

            items:
              cart.map(
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

        router.push(
          `/payments?orderId=${order.id}&amount=${total}`
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2 space-y-4">
        {cart.map((item) => (
          <CheckoutItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <div className="border rounded-xl p-6 h-fit">
        <h2 className="text-2xl font-bold">
          Order Summary
        </h2>

        <div className="mt-6 flex justify-between">
          <span>Total</span>

          <span>
            ₹{total}
          </span>
        </div>

        <button
          onClick={
            handleCheckout
          }
          disabled={loading}
          className="w-full mt-8 bg-black text-white py-3 rounded-xl"
        >
          {loading
            ? "Processing..."
            : "Place Order"}
        </button>
      </div>
    </div>
  );
}
