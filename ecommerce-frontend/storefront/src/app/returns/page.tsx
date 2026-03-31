// src/app/returns/page.tsx
"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import RefundsContainer from "@/components/returns/RefundsContainer";

export default function ReturnsPage() {
  return (
    <AuthLayout title="Returns / Refunds">
      <RefundsContainer />
    </AuthLayout>
  );
}
