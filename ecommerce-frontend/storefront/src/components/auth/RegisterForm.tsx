"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import GoogleLoginButton from "./GoogleLoginButton";

export default function RegisterForm() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     REDIRECT IF ALREADY LOGGED IN
  ===================================================== */

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      /* -----------------------------
         REGISTER USER
      ----------------------------- */

      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        address: address.trim(),
      });

      console.log("Registration successful:", res);

      /* -----------------------------
         SAVE AUTH
      ----------------------------- */

      setAuth(res.token, res.role);

      /* -----------------------------
         SHOW SUCCESS
      ----------------------------- */

      setSuccess(
        "Registration successful! Redirecting to your account..."
      );

      /* -----------------------------
         REDIRECT AFTER 1.5 SECONDS
      ----------------------------- */

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      console.error("Registration error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <h1>Register</h1>

      {/* NAME */}

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* EMAIL */}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* PASSWORD */}

      <input
        type="password"
        placeholder="Password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* PHONE */}

      <input
        type="text"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* ADDRESS */}

      <input
        type="text"
        placeholder="Address (optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        autoComplete="street-address"
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* REGISTER BUTTON */}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.7rem",
          background: loading ? "#999" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {/* ERROR */}

      {error && (
        <p
          style={{
            color: "red",
            fontSize: "14px",
            margin: 0,
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      {/* SUCCESS */}

      {success && (
        <p
          style={{
            color: "green",
            fontSize: "14px",
            fontWeight: "600",
            margin: 0,
            textAlign: "center",
          }}
        >
          {success}
        </p>
      )}

      <hr />

      {/* GOOGLE LOGIN */}

      <GoogleLoginButton />
    </form>
  );
}
