import { api } from "@/lib/api";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;

export interface AuthResponse {
  token: string;
  role: "USER" | "VENDOR" | "ADMIN";
}

// LOGIN
export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>(
    `${AUTH_API}/auth/login`,
    { email, password }
  );

  return data;
}

// REGISTER
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>(
    `${AUTH_API}/auth/register`,
    payload
  );

  return data;
}

// FORGOT PASSWORD
export async function forgotPassword(email: string) {
  const { data } = await api.post(
    `${AUTH_API}/auth/forgot-password`,
    { email }
  );

  return data;
}

// RESET PASSWORD
export async function resetPassword(token: string, newPassword: string) {
  const { data } = await api.post(
    `${AUTH_API}/auth/reset-password`,
    { token, newPassword }
  );

  return data;
}
