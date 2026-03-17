import { api } from "./api";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;

if (!AUTH_API) throw new Error("NEXT_PUBLIC_AUTH_API_URL not defined");

/**
 * Login
 */
export const loginUser = async (email: string, password: string) => {
  const res = await api.post(`${AUTH_API}/login`, { email, password });
  return res.data; // should return { token, role, user }
};

/**
 * Register
 */
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await api.post(`${AUTH_API}/register`, { name, email, password });
  return res.data;
};

/**
 * Forgot Password
 */
export const forgotPassword = async (email: string) => {
  const res = await api.post(`${AUTH_API}/forgot-password`, { email });
  return res.data;
};

/**
 * Reset Password
 */
export const resetPassword = async (token: string, newPassword: string) => {
  const res = await api.post(`${AUTH_API}/reset-password`, { token, password: newPassword });
  return res.data;
};
