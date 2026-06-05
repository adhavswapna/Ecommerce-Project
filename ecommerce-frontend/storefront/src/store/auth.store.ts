// src/store/auth.store.ts

"use client";

import { create } from "zustand";

/* =========================================
 * 👤 USER TYPE
 * ========================================= */
export interface User {
  id: string;

  name?: string;

  email: string;

  role?: string;
}

/* =========================================
 * 🧠 AUTH STATE
 * ========================================= */
interface AuthState {
  token: string | null;

  user: User | null;

  isAuthenticated: boolean;

  hydrated: boolean;

  setAuth: (
    token: string,
    user: User
  ) => void;

  logout: () => void;

  hydrate: () => void;
}

/* =========================================
 * 🔐 STORAGE KEYS
 * ========================================= */
const TOKEN_KEY = "token";

const USER_KEY = "user";

/* =========================================
 * ✅ SAFE TOKEN PARSER
 * ========================================= */
const getStoredToken =
  (): string | null => {
    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    try {
      const token =
        localStorage.getItem(
          TOKEN_KEY
        );

      if (
        !token ||
        token ===
          "undefined" ||
        token ===
          "null"
      ) {
        return null;
      }

      /**
       * ✅ CHECK JWT FORMAT
       */
      const parts =
        token.split(".");

      if (
        parts.length !== 3
      ) {
        localStorage.removeItem(
          TOKEN_KEY
        );

        return null;
      }

      /**
       * ✅ DECODE PAYLOAD
       */
      const payload =
        JSON.parse(
          atob(parts[1])
        );

      /**
       * ✅ CHECK EXPIRY
       */
      if (
        payload.exp &&
        payload.exp * 1000 <
          Date.now()
      ) {
        localStorage.removeItem(
          TOKEN_KEY
        );

        localStorage.removeItem(
          USER_KEY
        );

        return null;
      }

      return token;
    } catch (
      error
    ) {
      console.error(
        "❌ Invalid token:",
        error
      );

      localStorage.removeItem(
        TOKEN_KEY
      );

      return null;
    }
  };

/* =========================================
 * ✅ SAFE USER PARSER
 * ========================================= */
const getStoredUser =
  (): User | null => {
    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    try {
      const user =
        localStorage.getItem(
          USER_KEY
        );

      if (
        !user ||
        user ===
          "undefined" ||
        user === "null"
      ) {
        return null;
      }

      return JSON.parse(
        user
      );
    } catch (
      error
    ) {
      console.error(
        "❌ Invalid user:",
        error
      );

      localStorage.removeItem(
        USER_KEY
      );

      return null;
    }
  };

/* =========================================
 * 🏪 AUTH STORE
 * ========================================= */
export const useAuthStore =
  create<AuthState>(
    (set) => ({
      token: null,

      user: null,

      isAuthenticated:
        false,

      hydrated: false,

      /* =========================================
       * 💧 HYDRATE STORE
       * ========================================= */
      hydrate: () => {
        const token =
          getStoredToken();

        const user =
          getStoredUser();

        set({
          token,

          user,

          hydrated: true,

          isAuthenticated:
            !!token,
        });
      },

      /* =========================================
       * ✅ SET AUTH
       * ========================================= */
      setAuth: (
        token,
        user
      ) => {
        if (
          typeof window !==
          "undefined"
        ) {
          localStorage.setItem(
            TOKEN_KEY,
            token
          );

          localStorage.setItem(
            USER_KEY,
            JSON.stringify(
              user
            )
          );
        }

        set({
          token,

          user,

          isAuthenticated:
            true,
        });
      },

      /* =========================================
       * 🚪 LOGOUT
       * ========================================= */
      logout: () => {
        if (
          typeof window !==
          "undefined"
        ) {
          localStorage.removeItem(
            TOKEN_KEY
          );

          localStorage.removeItem(
            USER_KEY
          );
        }

        set({
          token: null,

          user: null,

          isAuthenticated:
            false,
        });
      },
    })
  );
