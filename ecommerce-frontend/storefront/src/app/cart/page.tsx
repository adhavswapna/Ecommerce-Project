"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartView from "@/components/cart/CartView";
import { requireAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    if (!requireAuth(router)) return;
  }, [router]);

  return <CartView />;
}
