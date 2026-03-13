"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{title}</h2>

      {children}

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          Don't have an account? <Link href="/register">Register</Link>
        </p>
        <p>
          Forgot password? <Link href="/forgot-password">Reset here</Link>
        </p>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
