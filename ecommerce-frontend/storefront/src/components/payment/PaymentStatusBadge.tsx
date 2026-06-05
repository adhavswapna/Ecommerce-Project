// src/components/payment/PaymentStatusBadge.tsx

"use client";

interface Props {
  status: string;
}

export default function PaymentStatusBadge({
  status,
}: Props) {
  const styles =
    status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : status === "FAILED"
      ? "bg-red-100 text-red-700"
      : status === "REFUNDED"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}
