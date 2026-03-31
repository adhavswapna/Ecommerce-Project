import { useState } from "react";
import { downloadInvoice, getInvoiceByOrderId } from "@/api/invoice.api";

export const useInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📄 GET INVOICE
  const fetchInvoice = async (orderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInvoiceByOrderId(orderId);
      return data;
    } catch (err: any) {
      console.error("❌ Invoice fetch failed:", err);
      setError(err?.response?.data?.message || "Failed to fetch invoice");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 📥 DOWNLOAD INVOICE
  const download = async (orderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await downloadInvoice(orderId);

      if (data?.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        setError("Download URL not found");
      }

      return data;
    } catch (err: any) {
      console.error("❌ Invoice download failed:", err);
      setError(err?.response?.data?.message || "Download failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchInvoice,
    download,
  };
};
