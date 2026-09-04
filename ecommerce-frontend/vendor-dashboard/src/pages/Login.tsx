import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      console.log("Vendor login response:", data);

      if (!data?.token) {
        alert(
          data?.message ||
            "Login failed. Your vendor account may still be pending approval."
        );
        return;
      }

      alert("Login successful.");

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Vendor login error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        Vendor Login
      </h2>

      <form onSubmit={submit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter vendor email"
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
        }}
      >
        <p style={{ marginBottom: "10px", color: "#666" }}>
          Don't have a vendor account?
        </p>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Register as Vendor
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
};
