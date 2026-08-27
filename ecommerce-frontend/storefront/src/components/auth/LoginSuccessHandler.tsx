"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/api/apiClient";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types/user";

export default function LoginSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const token = searchParams.get("token");

      console.log(
        "🔑 Google login token:",
        token ? "RECEIVED" : "MISSING"
      );

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        // Temporarily store token so the API interceptor can use it.
        localStorage.setItem("token", token);

        // Fetch the complete authenticated user.
        const response = await authApi.get<User>("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;

        console.log("✅ Google user received:", user);

        // Update Zustand + localStorage.
        useAuthStore.getState().setAuth(token, user);

        console.log("✅ Google authentication state updated");

        // Remove token from the browser URL.
        router.replace("/");
      } catch (error) {
        console.error(
          "❌ Failed to load Google user:",
          error
        );

        useAuthStore.getState().logout();

        router.replace("/login");
      }
    };

    handleGoogleLogin();
  }, [searchParams, router]);

  return <p>Logging you in...</p>;
}
