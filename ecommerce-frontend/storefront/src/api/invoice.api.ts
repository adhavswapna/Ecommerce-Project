import { invoiceApi } from "./apiClient";

/* ================================
   GET INVOICE BY ORDER ID
================================ */
export const getInvoiceByOrderId = async (orderId: string) => {
  const res = await invoiceApi.get(`/invoice/${orderId}`);
  return res.data;
};

/* ================================
   DOWNLOAD INVOICE (SIGNED URL)
================================ */
export const downloadInvoice = async (orderId: string) => {
  const res = await invoiceApi.get(`/invoice/${orderId}/download`);
  return res.data;
};
