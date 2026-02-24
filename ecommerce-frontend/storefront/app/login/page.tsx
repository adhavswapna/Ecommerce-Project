"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useAuthContext } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // EMAIL LOGIN
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token);

      router.push("/");

    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN REDIRECT
  // =========================
  const handleGoogleLogin = () => {
    setGoogleLoading(true);

    // Redirect to backend OAuth endpoint
    window.location.href =
      "http://127.0.0.1:3001/auth/google";
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-20 border rounded-lg shadow">

      <h1 className="text-2xl font-bold mb-6 text-center">
        Login
      </h1>

      {/* EMAIL LOGIN FORM */}
      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-3 text-right">
          <Link
            href="/forget-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forget Password?
          </Link>
        </div>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full rounded hover:bg-gray-800 transition mb-3"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="text-center my-4 text-gray-500">
        OR
      </div>

      {/* GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="border px-4 py-2 w-full rounded hover:bg-gray-100 transition"
      >
        {googleLoading
          ? "Redirecting..."
          : "Continue with Google"}
      </button>

      <div className="mt-4 text-center text-sm">
        <span>Don't have an account?</span>{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
