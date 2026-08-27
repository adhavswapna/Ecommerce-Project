import { apiClient } from "./apiClient";

import {
  Invoice,
} from "@/types/invoice";

/*
=====================================================
CREATE INVOICE
=====================================================
*/

export async function createInvoice(
  payload: {
    orderId: string;
    amount: number;
  }
): Promise<Invoice> {
  try {
    const { data } = await apiClient.post(
      "/invoices",
      payload
    );

    console.log(
      "CREATE INVOICE RESPONSE:",
      data
    );

    if (!data?.success || !data?.data) {
      throw new Error(
        data?.message || "Invoice creation failed"
      );
    }

    return data.data;
  } catch (error: any) {
    console.error(
      "CREATE INVOICE ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
}


/*
=====================================================
GET BY ORDER ID
=====================================================
*/

export async function getInvoiceByOrderId(
  orderId: string
): Promise<Invoice | null> {
  try {
    const { data } = await apiClient.get(
      `/invoices/order/${orderId}`
    );

    console.log(
      "GET INVOICE BY ORDER RESPONSE:",
      data
    );

    if (!data?.success || !data?.data) {
      return null;
    }

    return data.data;
  } catch (error: any) {
    console.error(
      "GET INVOICE ERROR:",
      error?.response?.data || error
    );

    return null;
  }
}


/*
=====================================================
GET INVOICE
=====================================================
*/

export async function getInvoice(
  invoiceId: string
): Promise<Invoice | null> {
  try {
    const { data } = await apiClient.get(
      `/invoices/${invoiceId}`
    );

    console.log(
      "GET INVOICE RESPONSE:",
      data
    );

    if (!data?.success || !data?.data) {
      return null;
    }

    return data.data;
  } catch (error: any) {
    console.error(
      "GET INVOICE ERROR:",
      error?.response?.data || error
    );

    return null;
  }
}


/*
=====================================================
DOWNLOAD PDF
=====================================================
*/

export async function downloadInvoice(
  invoiceId: string
): Promise<void> {
  try {
    /*
    -------------------------------------------------
    1. Get the signed MinIO download URL
    -------------------------------------------------
    */

    const { data } = await apiClient.get(
      `/invoices/${invoiceId}/download`
    );

    console.log(
      "DOWNLOAD INVOICE RESPONSE:",
      data
    );

    if (!data?.success || !data?.downloadUrl) {
      throw new Error(
        data?.message || "Invoice download URL not available"
      );
    }


    /*
    -------------------------------------------------
    2. Fetch the actual PDF from MinIO
    -------------------------------------------------
    */

    const pdfResponse = await fetch(
      data.downloadUrl
    );

    if (!pdfResponse.ok) {
      throw new Error(
        `PDF download failed: ${pdfResponse.status}`
      );
    }


    /*
    -------------------------------------------------
    3. Convert response to Blob
    -------------------------------------------------
    */

    const blob = await pdfResponse.blob();


    /*
    -------------------------------------------------
    4. Make sure we actually received a PDF
    -------------------------------------------------
    */

    if (
      !blob.type.includes("pdf") &&
      blob.size === 0
    ) {
      throw new Error(
        "Downloaded file is not a valid PDF"
      );
    }


    /*
    -------------------------------------------------
    5. Trigger browser download
    -------------------------------------------------
    */

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `invoice-${invoiceId}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    console.error(
      "DOWNLOAD INVOICE ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
}
