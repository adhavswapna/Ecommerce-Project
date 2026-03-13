import axios from "axios";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;

// ------------------- LOGIN -------------------
export async function login(email: string, password: string) {
  const { data } = await axios.post(`${AUTH_API}/auth/login`, { email, password });
  return data; // { token: string }
}

// ------------------- REGISTER USER -------------------
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await axios.post(`${AUTH_API}/auth/register`, payload);
  return data; // { token: string }
}

// ------------------- FORGOT PASSWORD -------------------
export async function forgotPassword(email: string) {
  const { data } = await axios.post(`${AUTH_API}/auth/forgot-password`, { email });
  return data; // { message: string }
}

// ------------------- RESET PASSWORD -------------------
export async function resetPassword(token: string, newPassword: string) {
  const { data } = await axios.post(`${AUTH_API}/auth/reset-password`, {
    token,
    newPassword,
  });
  return data; // { message: string }
}
