// src/api/payments.ts

import { paymentApi } from "./apiClient";


interface PaymentPayload {

  userId: string;

  orderId: string;

  amount: number;

  provider: string;

  currency: string;

}


export const createPayment =
async (
  data: PaymentPayload
) => {


  try {


    console.log(
      "💳 PAYMENT PAYLOAD",
      data
    );


    const response =
      await paymentApi.post(
        "/payments",
        data
      );


    return response.data;


  } catch(error:any){


    console.error(
      "PAYMENT ERROR",
      error.response?.data ||
      error.message
    );


    throw error;

  }

};
