"use client";

import {
  useState,
} from "react";

import {
  createPayment,
  getPaymentByOrder,
} from "@/api/payments";

export const usePayments =
  () => {
    const [
      payment,
      setPayment,
    ] = useState<any>(
      null
    );

    const [
      loading,
      setLoading,
    ] = useState(false);

    const pay =
      async (
        payload: {
          orderId: string;
          amount: number;
        }
      ) => {
        try {
          setLoading(true);

          const data =
            await createPayment(
              payload
            );

          setPayment(data);

          return data;
        } catch (
          error
        ) {
          console.error(
            error
          );

          return null;
        } finally {
          setLoading(false);
        }
      };

    const fetchPayment =
      async (
        orderId: string
      ) => {
        try {
          setLoading(true);

          const data =
            await getPaymentByOrder(
              orderId
            );

          setPayment(data);
        } catch (
          error
        ) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    return {
      payment,
      loading,
      pay,
      fetchPayment,
    };
  };
