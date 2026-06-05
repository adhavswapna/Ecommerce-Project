"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import PaymentCard from "./PaymentCard";

import { usePayments } from "@/hooks/usePayments";

interface Props {
  orderId: string;

  amount: number;
}

export default function PaymentView({
  orderId,
  amount,
}: Props) {
  const router = useRouter();

  const [method, setMethod] =
    useState("COD");

  const {
    loading,
    pay,
  } = usePayments();

  const handlePayment =
    async () => {
      try {
        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "{}"
          );

        const payment =
          await pay({
            userId:
              user.id,

            orderId,

            amount,

            provider:
              method,

            currency:
              "INR",
          });

        router.push(
          `/payments?success=true&id=${payment.id}`
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">
        Payment
      </h1>

      <div className="space-y-4">
        <PaymentCard
          title="Cash On Delivery"
          selected={
            method === "COD"
          }
          onSelect={() =>
            setMethod("COD")
          }
        />

        <PaymentCard
          title="Credit / Debit Card"
          selected={
            method === "CARD"
          }
          onSelect={() =>
            setMethod("CARD")
          }
        />
      </div>

      <div className="mt-10 border rounded-xl p-6">
        <div className="flex justify-between">
          <span>Total</span>

          <span>
            ₹{amount}
          </span>
        </div>

        <button
          onClick={
            handlePayment
          }
          disabled={loading}
          className="w-full mt-8 bg-black text-white py-3 rounded-xl"
        >
          {loading
            ? "Processing..."
            : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
