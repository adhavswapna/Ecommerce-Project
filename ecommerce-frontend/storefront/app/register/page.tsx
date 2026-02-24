"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async () => {
    await axios.post(
      "http://127.0.0.1:3001/auth/register/user",
      { email, password }
    );

    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-2 mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-black text-white py-2"
      >
        Register
      </button>
    </div>
  );
}

