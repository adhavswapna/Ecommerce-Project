// src/components/returns/RefundsContainer.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requireAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const REFUND_API = process.env.NEXT_PUBLIC_REFUND_API_URL;

export default function RefundsContainer() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [refunds, setRefunds] = useState<any[]>([]);

  const fetchRefunds = async () => {
    if (!requireAuth(router) || !orderId) return;
    const res = await api.get(`${REFUND_API}/refunds/order/${orderId}`);
    setRefunds(res.data || []);
  };

  return (
    <div>
      <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" />
      <button onClick={fetchRefunds}>Search</button>
      {refunds.map((r) => (
        <div key={r.id}>
          <p>Refund ID: {r.id}</p>
          <p>Amount: ₹{r.amount}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}
