// src/api/auth.ts

import { authApi } from "./apiClient";

/* =====================================================
   LOGIN
   POST /auth/login
===================================================== */

export async function login(
  email: string,
  password: string
) {
  const { data } = await authApi.post(
    "/login",
    {
      email,
      password,
    }
  );

  return data;
}

/* =====================================================
   REGISTER
   POST /auth/register
===================================================== */

export async function register(
  payload: {
    name: string;
    email: string;
    password: string;
  }
) {
  const { data } = await authApi.post(
    "/register",
    payload
  );

  return data;
}

/* =====================================================
   FORGOT PASSWORD
   POST /auth/forgot-password
===================================================== */

export async function forgotPassword(
  email: string
) {
  const { data } = await authApi.post(
    "/forgot-password",
    {
      email,
    }
  );

  return data;
}

/* =====================================================
   LOGOUT
   POST /auth/logout
===================================================== */

export async function logout() {
  const { data } = await authApi.post(
    "/logout"
  );

  return data;
}
