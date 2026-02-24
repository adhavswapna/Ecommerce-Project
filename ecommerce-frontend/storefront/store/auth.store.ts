import { create } from "zustand";
import { loginUser, registerUser, getCurrentUser } from "../auth.api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const token = await loginUser({ email, password });
    localStorage.setItem("token", token);
    const user = await getCurrentUser();
    set({ user, loading: false });
  },

  register: async (name, email, password, role) => {
    set({ loading: true });
    const token = await registerUser({ name, email, password, role });
    localStorage.setItem("token", token);
    const user = await getCurrentUser();
    set({ user, loading: false });
  },

  fetchUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
    } catch {
      localStorage.removeItem("token");
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));

