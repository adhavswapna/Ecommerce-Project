// src/components/orders/OrdersList.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserOrders } from "@/api/orders";
import { requireAuth, getUserFromToken } from "@/hooks/useAuth";
import OrderItem from "./OrderItem";

export default function OrdersList() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router)) return;

    const user = getUserFromToken();
    if (!user?.userId) return router.push("/login");

    getUserOrders(user.userId).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders yet</p>;

  return <div>{orders.map((o) => <OrderItem key={o.id} order={o} />)}</div>;
}
