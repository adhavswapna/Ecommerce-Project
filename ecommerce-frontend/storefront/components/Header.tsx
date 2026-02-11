"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/cart.store";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  name: string;
  role: string;
  exp?: number;
}

export default function Header() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const cartItems = useCartStore((state) => state.items);

  // Load JWT from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-primary">
        {process.env.NEXT_PUBLIC_APP_NAME || "Storefront"}
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>

        <Link href="/cart" className="relative hover:text-primary">
          Cart
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>

        {!user ? (
          <>
            <Link href="/login" className="hover:text-primary">
              Login
            </Link>
            <Link href="/register" className="hover:text-primary">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

