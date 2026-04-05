"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  // ✅ FIX: Get cart items and derive count
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.length;

  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname === path
      ? "font-semibold text-blue-600"
      : "hover:text-blue-600";

  if (!mounted) return null;

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">

      {/* LOGO */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        ShopSphere
      </Link>

      <div className="flex items-center gap-6 text-sm">

        {!token ? (
          <>
            <Link href="/" className={isActive("/")}>Home</Link>
            <Link href="/products" className={isActive("/products")}>Products</Link>
            <Link href="/login" className={isActive("/login")}>Login</Link>
            <Link href="/register" className={isActive("/register")}>Register</Link>
          </>
        ) : (
          <>
            <Link href="/products" className={isActive("/products")}>
              Products
            </Link>

            {/* 🛒 CART */}
            <Link href="/cart" className={`${isActive("/cart")} relative`}>
              🛒 Cart

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/orders" className={isActive("/orders")}>
              📦 Orders
            </Link>

            <Link href="/wishlist" className={isActive("/wishlist")}>
              ❤️ Wishlist
            </Link>

            <NotificationDropdown />

            {/* 👤 USER */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="font-medium hover:text-blue-600"
              >
                Hello, {user?.name || "User"} ▼
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border z-50">

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
