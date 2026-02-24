"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL!;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setMessage("Invalid token");
    if (password !== confirmPassword) return setMessage("Passwords do not match");

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${AUTH_API}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      setMessage(data.message || "Password reset successful");
      if (res.ok) setTimeout(() => router.push("/login"), 2000);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-6 text-center">Reset Password</h1>
      {message && <p className="text-green-600">{message}</p>}
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" required className="w-full mb-4 p-2 border rounded"/>
      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required className="w-full mb-4 p-2 border rounded"/>
      <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading ? "Resetting..." : "Reset Password"}</button>
    </form>
  );
}

