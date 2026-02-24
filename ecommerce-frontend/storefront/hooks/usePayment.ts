// hooks/usePayment.ts

import {
  createPayment,
  verifyPayment,
  refundPayment,
  getPaymentStatus,
  getPaymentsByOrder,
} from "@/lib/api/payment.api";
import { useState } from "react";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);

  const handleCreatePayment = async (paymentData: {
    userId: string;
    orderId: string;
    amount: number;
    provider: "cod" | "card" | "upi" | "netbanking";
    currency: "INR" | "USD";
    name?: string;
  }) => {
    setLoading(true);
    try {
      const res = await createPayment(paymentData);
      setPayment(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (
    paymentId: string,
    status: "SUCCESS" | "FAILED",
    transactionId?: string
  ) => {
    setLoading(true);
    try {
      const res = await verifyPayment(paymentId, status, transactionId);
      setPayment(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleRefundPayment = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await refundPayment(orderId);
      setStatus("REFUNDED");
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaymentStatus = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await getPaymentStatus(orderId);
      setStatus(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaymentsByOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await getPaymentsByOrder(orderId);
      setPayments(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    payment,
    payments,
    status,
    handleCreatePayment,
    handleVerifyPayment,
    handleRefundPayment,
    handleGetPaymentStatus,
    handleGetPaymentsByOrder,
  };
};

