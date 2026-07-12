"use client";

import { useState } from "react";
import {
  createInvoice,
  downloadInvoice,
} from "@/api/invoice.api";

interface Props {
  orderId: string;
  amount: number;
}

export default function InvoiceButton({ orderId, amount }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      // 1. Always create invoice first (safe fallback)
      const invoice = await createInvoice({
        orderId,
        amount,
      });

      if (!invoice?.id) {
        throw new Error("Invoice creation failed");
      }

      // 2. Download directly using invoice ID
      await downloadInvoice(invoice.id);
    } catch (error) {
      console.error("Invoice error:", error);
      alert("Invoice not available or backend missing route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="
        bg-black
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-gray-800
        disabled:opacity-50
      "
    >
      {loading ? "Generating Invoice..." : "Download Invoice"}
    </button>
  );
}
