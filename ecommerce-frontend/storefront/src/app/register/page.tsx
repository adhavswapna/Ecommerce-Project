"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create a ShopSphere Account">
      <RegisterForm />
    </AuthLayout>
  );
}
