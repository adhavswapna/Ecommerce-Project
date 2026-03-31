"use client";

import { useEffect, useState } from "react";
import { getUserPayments } from "@/api/payments";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
}

export const usePayments = (userId: string) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getUserPayments(userId);
      setPayments(data);
    } catch (err) {
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchPayments();
  }, [userId]);

  return { payments, loading, error, refetch: fetchPayments };
};
