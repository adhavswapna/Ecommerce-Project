"use client";

import { useState } from "react";

import { useInvoice } from "@/hooks/useInvoice";

interface Props {
  orderId: string;

  amount: number;
}

export default function InvoiceButton({
  orderId,
  amount,
}: Props) {
  const {
    loading,
    generateInvoice,
  } = useInvoice();

  const [invoiceUrl, setInvoiceUrl] =
    useState("");

  const handleGenerate =
    async () => {
      try {
        const invoice =
          await generateInvoice({
            orderId,
            amount,
          });

        setInvoiceUrl(
          invoice.fileUrl
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <button
        onClick={
          handleGenerate
        }
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
      >
        {loading
          ? "Generating..."
          : "Generate Invoice"}
      </button>

      {invoiceUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">
            Invoice generated
            successfully
          </p>

          <p className="text-sm text-gray-500 mt-2 break-all">
            {invoiceUrl}
          </p>
        </div>
      )}
    </div>
  );
}
