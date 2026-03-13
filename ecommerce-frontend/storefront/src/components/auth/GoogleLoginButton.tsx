"use client";

export default function GoogleLoginButton() {
  return (
    <button
      style={{ padding: "0.5rem", cursor: "pointer" }}
      onClick={() => {
        window.location.href = process.env.NEXT_PUBLIC_AUTH_API_URL + "/auth/google";
      }}
    >
      Continue with Google
    </button>
  );
}
