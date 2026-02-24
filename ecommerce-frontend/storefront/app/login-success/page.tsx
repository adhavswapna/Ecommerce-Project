"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/AuthProvider";

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token);      // Save token in context/localStorage
      router.push("/");  // Redirect to homepage
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="p-6 text-center mt-20">
      <h2 className="text-xl font-semibold">
        Logging you in...
      </h2>
    </div>
  );
}
