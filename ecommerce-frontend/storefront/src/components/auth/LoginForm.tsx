"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { decodeJwtUser, UserRole } from "@/types/user";

import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();

  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("🔐 Login started");

      const res = await login(email, password);

      console.log("✅ Login response:", res);

      if (!res?.token) {
        throw new Error("Login successful but token was not returned");
      }

      /*
       * Backend returns:
       *
       * {
       *   token: "JWT..."
       * }
       *
       * The JWT itself contains:
       * userId, name, email and role.
       */

      const jwtUser = decodeJwtUser(res.token);

      console.log("🔑 Decoded JWT user:", jwtUser);

      if (!jwtUser?.userId) {
        throw new Error("Invalid login token");
      }

      /*
       * Create the User object expected by auth.store.ts
       */
      const user = {
        id: jwtUser.userId,
        name: jwtUser.name,
        email: jwtUser.email,
        role: jwtUser.role as UserRole,
        phone: null,
        address: null,
      };

      console.log("👤 User created:", user);

      /*
       * Store BOTH token and user.
       */
      setAuth(res.token, user);

      console.log("✅ Authentication stored");

      router.push("/");
    } catch (err: any) {
      console.error("❌ Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h2>Login</h2>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "0.6rem",
        }}
      />

      {/* PASSWORD */}
      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            width: "100%",
          }}
        />

        <span
          onClick={() =>
            setShowPassword(!showPassword)
          }
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {showPassword ? "🙈" : "👁"}
        </span>
      </div>

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.6rem",
          cursor: "pointer",
        }}
      >
        {loading
          ? "Logging in..."
          : "Login"}
      </button>

      {/* ERROR MESSAGE */}
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "14px",
          }}
        >
          {error}
        </p>
      )}

      <hr />

      {/* GOOGLE LOGIN */}
      <GoogleLoginButton />
    </form>
  );
}


