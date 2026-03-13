"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import GoogleLoginButton from "./GoogleLoginButton";

export default function RegisterForm() {
const router = useRouter();

const token = useAuthStore((s) => s.token);
const setToken = useAuthStore((s) => s.setToken);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

// redirect if already logged in
useEffect(() => {
if (token) {
router.push("/");
}
}, [token, router]);

const handleRegister = async (e: React.FormEvent) => {
e.preventDefault();
setError("");

```
// required fields validation
if (!name || !email || !password) {
  setError("Name, email and password are required");
  return;
}

// password rule
if (password.length < 8) {
  setError("Password must be at least 8 characters");
  return;
}

setLoading(true);

try {
  const res = await registerUser({
    name,
    email,
    password,
    phone,
    address,
  });

  // save token in zustand
  setToken(res.token);

  // redirect to homepage
  router.push("/");

} catch (err: any) {
  setError(err?.response?.data?.message || "Registration failed");
} finally {
  setLoading(false);
}
```

};

return (
<form
onSubmit={handleRegister}
style={{
display: "flex",
flexDirection: "column",
gap: "1rem",
maxWidth: "400px",
}}
> <h1>Register</h1>

```
  <input
    type="text"
    placeholder="Full Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    style={{ padding: "0.6rem" }}
  />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    style={{ padding: "0.6rem" }}
  />

  <input
    type="password"
    placeholder="Password (min 8 characters)"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{ padding: "0.6rem" }}
  />

  <input
    type="text"
    placeholder="Phone (optional)"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    style={{ padding: "0.6rem" }}
  />

  <input
    type="text"
    placeholder="Address (optional)"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    style={{ padding: "0.6rem" }}
  />

  <button
    type="submit"
    disabled={loading}
    style={{
      padding: "0.6rem",
      cursor: "pointer",
    }}
  >
    {loading ? "Registering..." : "Register"}
  </button>

  {error && (
    <p style={{ color: "red", fontSize: "14px" }}>
      {error}
    </p>
  )}

  <hr />

  <GoogleLoginButton />
</form>

);
}

