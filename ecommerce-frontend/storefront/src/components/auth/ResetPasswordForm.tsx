"use client";

import { useState } from "react";
import { resetPassword } from "@/api/auth.api";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Call API to reset password
      await resetPassword(token, newPassword);
      setMessage("✅ Password reset successful. You can now login.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Reset Password</h1>

      {/* New Password */}
      <div style={{ position: "relative" }}>
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%" }}
        />
        <span
          onClick={() => setShowNew(!showNew)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {showNew ? "👁️" : "🙈"}
        </span>
      </div>

      {/* Confirm Password */}
      <div style={{ position: "relative" }}>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%" }}
        />
        <span
          onClick={() => setShowConfirm(!showConfirm)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {showConfirm ? "👁️" : "🙈"}
        </span>
      </div>

      <button
        type="submit"
        style={{ padding: "0.5rem", cursor: loading ? "not-allowed" : "pointer" }}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </form>
  );
}
