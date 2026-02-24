
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth.api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser(); // ✅ FIXED
      setUser(userData);
    } catch {
      logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    loadUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
