"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
interface User {
  userId: string;
  email?: string;
  role?: string;
  exp?: number;
}

/* ================= TOKEN PARSER ================= */
export function getUserFromToken(): User | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    // ✅ check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/* ================= REQUIRE AUTH ================= */
export function requireAuth(router: any): boolean {
  const user = getUserFromToken();

  if (!user) {
    router.push("/login");
    return false;
  }

  return true;
}

/* ================= HOOK ================= */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const userData = getUserFromToken();

    if (!userData) {
      router.push("/login");
    } else {
      setUser(userData);
    }

    setLoading(false);
  }, []);

  return { user, loading };
}
