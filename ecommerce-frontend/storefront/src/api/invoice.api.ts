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
  payload:any
):Promise<Invoice>{


  const {data} =
    await apiClient.post(
      "/invoices",
      payload
    );


  return data;

}







/*
=====================================================
GET BY ORDER ID
=====================================================
*/

export async function getInvoiceByOrderId(
 orderId:string
):Promise<Invoice|null>{


 try {


  const {data} =
    await apiClient.get(
      `/invoices/order/${orderId}`
    );


  return data;


 }
 catch(error:any){


  console.error(
    "GET INVOICE ERROR",
    error?.response?.data
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
 invoiceId:string
):Promise<Invoice|null>{


 try {


 const {data} =
 await apiClient.get(
  `/invoices/${invoiceId}`
 );


 return data;


 }
 catch(error:any){


 console.error(
  "GET INVOICE ERROR",
  error?.response?.data
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
 invoiceId:string
){


 const response =
 await apiClient.get(

   `/invoices/${invoiceId}/download`,

   {
    responseType:"blob"
   }

 );



 const blob =
 new Blob(
  [
   response.data
  ],
  {
   type:"application/pdf"
  }
 );



 const url =
 window.URL.createObjectURL(blob);



 const link =
 document.createElement("a");


 link.href=url;


 link.download =
 `invoice-${invoiceId}.pdf`;



 link.click();



 window.URL.revokeObjectURL(url);

}
