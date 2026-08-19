import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      /*
       * Login request
       */
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Vendor login response:", response.data);

      const token = response.data?.token;

      if (!token) {
        throw new Error(
          "Login successful but token was not returned."
        );
      }

      /*
       * Decode JWT
       */
      let payload: any;

      try {
        const base64Payload = token.split(".")[1];

        if (!base64Payload) {
          throw new Error("Invalid JWT structure");
        }

        payload = JSON.parse(
          atob(
            base64Payload
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );
      } catch (error) {
        console.error("JWT decode error:", error);

        throw new Error(
          "Invalid authentication token."
        );
      }

      console.log("Vendor JWT payload:", payload);

      /*
       * Make sure account is actually VENDOR
       */
      if (payload.role !== "VENDOR") {
        alert(
          "This account is not a vendor account."
        );

        return;
      }

      /*
       * Save vendor authentication data
       */
      localStorage.setItem(
        "vendorToken",
        token
      );

      localStorage.setItem(
        "vendorUser",
        JSON.stringify(payload)
      );

      console.log(
        "Vendor token saved successfully."
      );

      console.log(
        "Vendor user saved:",
        payload
      );

      alert("Vendor login successful!");

      navigate("/dashboard");
    } catch (err: any) {
      console.error(
        "Vendor login error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password";

      alert(`Login failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>Vendor Login</h2>

      <form onSubmit={submit}>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter vendor email"
            autoComplete="email"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}
