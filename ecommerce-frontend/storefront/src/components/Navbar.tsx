"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => setMounted(true), []);

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
    pathname === path ? "font-semibold underline" : "hover:text-blue-600";

  if (!mounted) return null;

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      
      {/* LOGO */}
      <Link href="/" className="text-2xl font-bold">
        ShopSphere
      </Link>

      {/* NAV LINKS */}
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

            <Link href="/cart" className={isActive("/cart")}>
              🛒 Cart
            </Link>

            <Link href="/orders" className={isActive("/orders")}>
              📦 Orders
            </Link>

            <Link href="/wishlist" className={isActive("/wishlist")}>
              ❤️ Wishlist
            </Link>

            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="font-medium"
              >
                Hello, {user?.name || "User"} ▼
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border">

                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>

                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
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
