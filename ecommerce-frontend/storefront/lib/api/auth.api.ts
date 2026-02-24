import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_AUTH_API_URL;

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post(`${BASE}/auth/register`, data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(`${BASE}/auth/login`, data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get(`${BASE}/auth/me`);
  return response.data;
};
