import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      if (!token) {
        throw new Error("Login token was not received");
      }

      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Only ADMIN can access this dashboard
      if (payload.role !== "ADMIN") {
        throw new Error("Access denied. Admin account required.");
      }

      // Save token
      localStorage.setItem("adminToken", token);

      // Save admin information
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        })
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Admin login error:", err);

      // Remove invalid token
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "360px",
          padding: "30px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          Admin Login
        </h1>

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              color: "#b91c1c",
              background: "#fee2e2",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "18px" }}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@shopsphere.com"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "11px",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
