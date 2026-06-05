import { invoiceApi } from "./apiClient";

import { Invoice } from "@/types/invoice";



/*
=====================================================
📄 CREATE INVOICE
=====================================================
*/

export async function createInvoice(
  payload: any
): Promise<Invoice> {

  try {

    const { data } =
      await invoiceApi.post(
        "/invoices",
        payload
      );


    return data;


  } catch (error: any) {


    console.error(
      "❌ CREATE INVOICE ERROR",
      error?.response?.data ||
      error.message ||
      error
    );


    throw error;

  }

}





/*
=====================================================
📄 GET INVOICE BY ORDER ID
=====================================================
*/

export async function getInvoiceByOrderId(
  orderId: string
): Promise<Invoice | null> {


  try {


    const { data } =
      await invoiceApi.get(
        `/invoices/order/${orderId}`
      );


    return data;


  } catch (error: any) {


    console.error(
      "❌ GET INVOICE ERROR",
      error?.response?.data ||
      error.message ||
      error
    );


    return null;

  }

}





/*
=====================================================
📄 GET INVOICE BY ID
=====================================================
*/

export async function getInvoice(
  invoiceId: string
): Promise<Invoice | null> {


  try {


    const { data } =
      await invoiceApi.get(
        `/invoices/${invoiceId}`
      );


    return data;


  } catch (error: any) {


    console.error(
      "❌ GET INVOICE FAILED",
      error?.response?.data ||
      error.message ||
      error
    );


    return null;

  }

}





/*
=====================================================
⬇ DOWNLOAD PDF
=====================================================
*/

export async function downloadInvoice(
  invoiceId: string
) {


  try {


    const response =
      await invoiceApi.get(
        `/invoices/${invoiceId}/download`,
        {
          responseType: "blob"
        }
      );



    const blob =
      new Blob(
        [response.data],
        {
          type: "application/pdf"
        }
      );



    const url =
      window.URL.createObjectURL(blob);



    const link =
      document.createElement("a");


    link.href = url;


    link.download =
      `invoice-${invoiceId}.pdf`;


    link.click();



    window.URL.revokeObjectURL(url);



  } catch (error: any) {


    console.error(
      "❌ DOWNLOAD INVOICE ERROR",
      error?.response?.data ||
      error.message ||
      error
    );


    throw error;

  }

}
