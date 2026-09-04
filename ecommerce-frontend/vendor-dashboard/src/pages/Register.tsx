import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerVendor } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Name, email and password are required.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerVendor({
        name,
        email,
        password,
        phone,
        address,
      });

      console.log("Vendor registration response:", data);

      alert(
        data?.message ||
          "Registration submitted successfully. Your account is pending admin approval."
      );

      navigate("/login");
    } catch (err: any) {
      console.error(
        "Vendor registration error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Vendor registration failed.";

      alert(`Registration failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h2>Vendor Registration</h2>

      <p
        style={{
          color: "#666",
          marginBottom: "20px",
        }}
      >
        Create your vendor account. Your account will
        require admin approval before you can log in.
      </p>

      <form onSubmit={submit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter vendor name"
            autoComplete="name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
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
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Create password"
            autoComplete="new-password"
            style={inputStyle}
          />

          <small style={{ color: "#666" }}>
            Minimum 8 characters
          </small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone</label>

          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="Enter phone number"
            autoComplete="tel"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Address</label>

          <textarea
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            placeholder="Enter business address"
            rows={3}
            style={inputStyle}
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
            ? "Registering..."
            : "Register as Vendor"}
        </button>
      </form>

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        Already registered?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            border: "none",
            background: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </p>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
};
