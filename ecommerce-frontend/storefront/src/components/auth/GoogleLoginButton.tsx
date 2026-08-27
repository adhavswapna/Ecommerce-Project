"use client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8081/api";

    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      style={{
        width: "100%",
        padding: "0.6rem",
        cursor: "pointer",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "white",
      }}
    >
      Continue with Google
    </button>
  );
}
