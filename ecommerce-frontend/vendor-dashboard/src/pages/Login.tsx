import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(
        "Vendor login response:",
        response.data
      );

      const token =
        response.data?.token;

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
        payload = JSON.parse(
          atob(token.split(".")[1])
        );
      } catch (error) {
        console.error(
          "JWT decode error:",
          error
        );

        throw new Error(
          "Invalid authentication token."
        );
      }

      console.log(
        "Vendor JWT payload:",
        payload
      );

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

      alert(
        "Vendor login successful!"
      );

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

      <p>
        Login using your approved vendor account.
      </p>

      <form onSubmit={submit}>

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>Email</label>

          <br />

          <input
            type="email"
            placeholder="Vendor Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>Password</label>

          <br />

          <input
            type="password"
            placeholder="Vendor Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
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
