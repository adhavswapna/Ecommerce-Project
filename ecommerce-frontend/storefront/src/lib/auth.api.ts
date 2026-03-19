import { api } from "./api";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;

if (!AUTH_API) throw new Error("NEXT_PUBLIC_AUTH_API_URL not defined");

/**
 * Types
 */
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Save token
 */
const saveAuth = (data: AuthResponse) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

/**
 * Clear auth
 */
export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

/**
 * Login
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await api.post(`${AUTH_API}/login`, { email, password });

    saveAuth(res.data);

    return res.data;
  } catch (error: any) {
    console.error("Login failed:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

/**
 * Register
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await api.post(`${AUTH_API}/register`, {
      name,
      email,
      password,
    });

    return res.data;
  } catch (error: any) {
    console.error("Register failed:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post(`${AUTH_API}/forgot-password`, { email });
    return res.data;
  } catch (error: any) {
    console.error("Forgot password error:", error?.response?.data || error.message);
    throw new Error("Failed to send reset email");
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  try {
    const res = await api.post(`${AUTH_API}/reset-password`, {
      token,
      password: newPassword,
    });

    return res.data;
  } catch (error: any) {
    console.error("Reset password error:", error?.response?.data || error.message);
    throw new Error("Failed to reset password");
  }
};
