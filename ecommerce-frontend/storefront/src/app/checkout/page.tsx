// src/app/checkout/page.tsx
"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import CheckoutContainer from "@/components/checkout/CheckoutContainer";

export default function CheckoutPage() {
  return (
    <AuthLayout title="Checkout">
      <CheckoutContainer />
    </AuthLayout>
  );
}
