"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL!;

export default function ForgetPasswordPage() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Read token from URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      setStep("reset");
    }
  }, [searchParams]);

  // =====================
  // REQUEST RESET LINK
  // =====================
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${AUTH_API}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send reset link");

      setMessage(
        "If the email exists, a reset link has been sent. Please check your email."
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // RESET PASSWORD
  // =====================
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${AUTH_API}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage("Password reset successful. You can now login.");
      setStep("email");
      setEmail("");
      setToken("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-6 text-center font-bold">
        {step === "email" ? "Forgot Password" : "Reset Password"}
      </h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {step === "email" ? (
        <form onSubmit={handleRequestReset}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            autoComplete="new-password"
            required
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

