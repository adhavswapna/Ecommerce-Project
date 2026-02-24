"use client";
import React from "react";

interface Props {
  orderId: string;
  onReturn?: () => void;
}

export default function CancelButton({ orderId, onReturn }: Props) {
  const handleReturn = async () => {
    await fetch(`http://localhost:3006/orders/return/${orderId}`, { method: "POST" });
    if (onReturn) onReturn();
  };

  return (
    <button
      className="bg-red-600 text-white py-2 px-4 rounded"
      onClick={handleReturn}
    >
      Return & Refund
    </button>
  );
}

