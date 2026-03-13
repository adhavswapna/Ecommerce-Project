"use client";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";

// Get the token from query params
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
