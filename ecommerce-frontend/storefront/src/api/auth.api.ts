// src/api/auth.api.ts

import { authApi } from "./apiClient";

export interface AuthResponse {
  token: string;
  role: "USER" | "VENDOR" | "ADMIN";
}

// 🔐 LOGIN
export async function login(email: string, password: string) {
  const { data } = await authApi.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }

  return data;
}

// 📝 REGISTER
export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) {
  const { data } = await authApi.post<AuthResponse>(
    "/auth/register",
    payload
  );

  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }

  return data;
}

// 👤 GET CURRENT USER ✅ (FIXED)
export async function getMe() {
  try {
    const { data } = await authApi.get("/auth/me");
    return data;
  } catch (error: any) {
    console.error(
      "getMe error:",
      error.response?.data || error.message || error.toString()
    );
    return null;
  }
}

// 🚪 LOGOUT
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
