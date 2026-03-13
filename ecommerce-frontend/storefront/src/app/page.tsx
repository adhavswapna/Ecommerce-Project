"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { getMe } from "@/api/user.api";

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Fetch user info
  useEffect(() => {
    if (token) {
      getMe()
        .then((data) => setUser(data))
        .catch(() => {
          logout(); // token invalid
          router.push("/login");
        })
        .finally(() => setLoading(false));
    }
  }, [token, router, logout]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        style={{ marginTop: "1rem", padding: "0.5rem", cursor: "pointer" }}
      >
        Logout
      </button>
    </div>
  );
}
