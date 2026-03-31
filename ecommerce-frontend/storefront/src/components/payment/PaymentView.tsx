"use client";

import { usePayments } from "@/hooks/usePayments";
import PaymentCard from "./PaymentCard";

interface Props {
  userId: string;
}

export default function PaymentView({ userId }: Props) {
  const { payments, loading, error } = usePayments(userId);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading payments...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (payments.length === 0) {
    return <p className="p-6 text-gray-500">💳 No payments found</p>;
  }

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-4">
      {payments.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}

      <div className="text-right font-bold text-lg mt-4">
        Total Spent: ${total.toFixed(2)}
      </div>
    </div>
  );
}
