"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text(); // in case server returns HTML
        throw new Error(`Login failed: ${text}`);
      }

      const data = await res.json();
      console.log("Login success:", data);

      // Save JWT in localStorage
      localStorage.setItem("token", data.token);

      // Redirect to home
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}

