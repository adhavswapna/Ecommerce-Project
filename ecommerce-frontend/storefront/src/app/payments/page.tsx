"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { createPayment } from "@/api/payments";
import { confirmOrder } from "@/api/checkout";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/auth.store";

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useAuthStore((state) => state.user);

  const { clear } = useCartStore();

  const orderId =
    searchParams.get("orderId") || "";

  const amount = Number(
    searchParams.get("amount") || 0
  );

  const [loading, setLoading] =
    useState(false);

  const [provider, setProvider] =
    useState("COD");

  const paymentMethods = [
    {
      id: "COD",
      title: "Cash On Delivery",
      subtitle:
        "Pay when your order is delivered",
      icon: "💵",
    },
    {
      id: "UPI",
      title: "UPI",
      subtitle:
        "Google Pay • PhonePe • Paytm • BHIM",
      icon: "📱",
    },
    {
      id: "CARD",
      title: "Credit / Debit Card",
      subtitle:
        "Visa • Mastercard • RuPay",
      icon: "💳",
    },
    {
      id: "NETBANKING",
      title: "Net Banking",
      subtitle:
        "All major Indian banks",
      icon: "🏦",
    },
    {
      id: "WALLET",
      title: "Wallet",
      subtitle:
        "Amazon Pay • Paytm Wallet",
      icon: "👛",
    },
  ];


  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      if (!orderId) {
        toast.error("Order not found");
        return;
      }

      const payment = await createPayment({
        userId: user.id,
        orderId,
        amount,
        provider,
        currency: "INR",
      });

      console.log("Payment:", payment);

      await confirmOrder(orderId);

      await clear();

      toast.success("Payment successful");

      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Payment
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">

          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Select Payment Method
            </h2>

            <div className="space-y-4">

              {paymentMethods.map((method) => (

                <label
                  key={method.id}
                  className={`
                    flex
                    items-center
                    justify-between
                    border
                    rounded-xl
                    p-5
                    cursor-pointer
                    transition

                    ${
                      provider === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400"
                    }
                  `}
                >

                  <div className="flex items-center gap-4">

                    <input
                      type="radio"
                      name="payment"
                      checked={provider === method.id}
                      onChange={() =>
                        setProvider(method.id)
                      }
                    />

                    <div className="text-3xl">
                      {method.icon}
                    </div>

                    <div>

                      <h3 className="font-bold text-lg">
                        {method.title}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {method.subtitle}
                      </p>

                    </div>

                  </div>

                </label>

              ))}

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit">

          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between">
            <span>Order ID</span>

            <span className="font-medium text-right break-all">
              {orderId}
            </span>
          </div>

          <div className="mt-4 flex justify-between">
            <span>Payment Method</span>

            <span className="font-semibold">
              {provider}
            </span>
          </div>

          <div className="mt-6 border-t pt-6 flex justify-between text-3xl font-bold">

            <span>Total</span>

            <span>₹{amount}</span>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="
              w-full
              mt-8
              bg-black
              hover:bg-gray-800
              text-white
              py-4
              rounded-xl
              font-bold
              text-lg
              disabled:opacity-50
            "
          >
            {loading
              ? "Processing Payment..."
              : `Pay ₹${amount}`}
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            This is a demo payment page. Online payment
            methods are simulated and can be integrated
            later with Razorpay, Stripe, or another
            payment gateway.
          </p>

        </div>

      </div>
    </main>
  );
}
