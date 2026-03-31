// src/app/orders/page.tsx
"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import OrdersList from "@/components/orders/OrdersList";

export default function OrdersPage() {
  return (
    <AuthLayout title="My Orders">
      <OrdersList />
    </AuthLayout>
  );
}
