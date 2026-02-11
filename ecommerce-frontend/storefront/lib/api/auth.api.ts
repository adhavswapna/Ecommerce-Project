import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_AUTH_API_URL;

export const login = async (email: string, password: string) => {
  const res = await api.post(`${BASE}/login`, { email, password });
  return res.data;
};

export const register = async (data: any) => {
  const res = await api.post(`${BASE}/register`, data);
  return res.data;
};

