"use client";

import { create } from "zustand";

import toast from "react-hot-toast";

import {
  downloadInvoice,
} from "@/api/invoice.api";

interface InvoiceState {
  loading: boolean;

  download:
    (
      orderId: string
    ) => Promise<void>;
}

export const useInvoiceStore =
  create<InvoiceState>(
    (set) => ({
      loading: false,

      download: async (
        orderId
      ) => {
        try {
          set({
            loading: true,
          });

          const blob =
            await downloadInvoice(
              orderId
            );

          const url =
            window.URL.createObjectURL(
              blob
            );

          const link =
            document.createElement(
              "a"
            );

          link.href = url;

          link.download =
            `invoice-${orderId}.pdf`;

          link.click();

          toast.success(
            "Invoice downloaded"
          );
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to download invoice"
          );
        } finally {
          set({
            loading: false,
          });
        }
      },
    })
  );
