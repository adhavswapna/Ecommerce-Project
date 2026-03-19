"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";

export default function Navbar() {
  const { token, role, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

  /* ================= MOUNT FIX (HYDRATION SAFE) ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= PARSE TOKEN (SAFE + MEMOIZED) ================= */
  const user = useMemo(() => {
    try {
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      // Optional expiry check
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }, [token]);

  /* ================= FETCH CART COUNT ================= */
  useEffect(() => {
    if (!mounted) return;
    if (!user?.userId || role !== "USER") return;

    const fetchCart = async () => {
      try {
        const res = await api.get(`${CART_API}/cart/${user.userId}`);

        const total = (res.data || []).reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );

        setCartCount(total);
      } catch (err) {
        console.error("Cart fetch failed:", err);
      }
    };

    fetchCart();
  }, [user, role, mounted, CART_API]);

  /* ================= HELPERS ================= */
  const isActive = (path: string) =>
    pathname === path
      ? "font-semibold underline"
      : "text-gray-600 hover:text-black";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  /* ================= HYDRATION GUARD ================= */
  if (!mounted) return null;

  /* ================= UI ================= */
  return (
    <nav className="sticky top-0 z-50 bg-white border-b px-6 py-3 flex justify-between items-center">
      {/* LOGO */}
      <Link href="/" className="text-xl font-bold">
        ShopSphere
      </Link>

      {/* LINKS */}
      <div className="flex items-center gap-5 text-sm">
        {/* PUBLIC */}
        {!token && (
          <>
            <Link href="/" className={isActive("/")}>
              Home
            </Link>
            <Link href="/products" className={isActive("/products")}>
              Products
            </Link>
            <Link href="/login" className={isActive("/login")}>
              Login
            </Link>
            <Link href="/register" className={isActive("/register")}>
              Register
            </Link>
          </>
        )}

        {/* USER */}
        {token && role === "USER" && (
          <>
            <span className="text-gray-700">
              Hi, {user?.name || "User"} 👋
            </span>

            <Link href="/products" className={isActive("/products")}>
              Products
            </Link>

            <Link href="/cart" className={isActive("/cart")}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            <Link href="/orders" className={isActive("/orders")}>
              Orders
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
