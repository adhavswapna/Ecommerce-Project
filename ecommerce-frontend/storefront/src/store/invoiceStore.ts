"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import { downloadInvoice } from "@/api/invoice.api";

interface InvoiceState {
  loading: boolean;
  download: (invoiceId: string) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  loading: false,

  download: async (invoiceId: string) => {
    try {
      set({ loading: true });

      await downloadInvoice(invoiceId);

      toast.success("Invoice downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    } finally {
      set({ loading: false });
    }
  },
}));
