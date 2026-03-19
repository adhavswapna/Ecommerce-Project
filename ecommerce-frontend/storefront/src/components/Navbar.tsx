"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";

export default function Navbar() {
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

  useEffect(() => setMounted(true), []);

  /* ================= USER DECODE ================= */
  const user = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  }, [token]);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (!mounted || !user?.userId) return;

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
  }, [user, mounted, CART_API]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname === path
      ? "font-semibold underline"
      : "hover:text-blue-600";

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold">
          ShopSphere
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8 text-sm">

          {/* PUBLIC */}
          {!token && (
            <>
              <Link href="/" className={`px-2 ${isActive("/")}`}>Home</Link>
              <Link href="/products" className={`px-2 ${isActive("/products")}`}>Products</Link>
              <Link href="/login" className={`px-2 ${isActive("/login")}`}>Login</Link>
              <Link href="/register" className={`px-2 ${isActive("/register")}`}>Register</Link>
            </>
          )}

          {/* LOGGED IN */}
          {token && (
            <>
              {/* MAIN LINKS */}
              <div className="flex items-center gap-6">
                <Link href="/products" className={`px-2 ${isActive("/products")}`}>
                  Products
                </Link>

                <Link href="/wishlist" className={`px-2 ${isActive("/wishlist")}`}>
                  ❤️ Wishlist
                </Link>

                <Link href="/orders" className={`px-2 ${isActive("/orders")}`}>
                  📦 Orders
                </Link>

                <Link href="/returns" className={`px-2 ${isActive("/returns")}`}>
                  🔄 Returns
                </Link>
              </div>

              {/* ACCOUNT SECTION (AMAZON STYLE) */}
              <div className="relative flex flex-col leading-tight">
                <span className="text-xs text-gray-500">
                  Hello, {user?.name || "User"}
                </span>

                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="font-semibold hover:underline text-left"
                >
                  Account & Lists ▼
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-10 w-64 bg-white shadow-xl rounded-lg p-4 z-50">

                    <div className="border-b pb-2 mb-3">
                      <p className="font-semibold">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <Link href="/profile" className="block px-2 py-1 hover:bg-gray-100 rounded">
                        👤 Your Profile
                      </Link>

                      <Link href="/orders" className="block px-2 py-1 hover:bg-gray-100 rounded">
                        📦 Your Orders
                      </Link>

                      <Link href="/returns" className="block px-2 py-1 hover:bg-gray-100 rounded">
                        🔄 Returns & Refunds
                      </Link>

                      <Link href="/wishlist" className="block px-2 py-1 hover:bg-gray-100 rounded">
                        ❤️ Wishlist
                      </Link>
                    </div>

                    <div className="border-t mt-3 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-1 text-red-500 hover:bg-gray-100 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CART */}
              <Link
                href="/cart"
                className={`relative px-3 py-2 border rounded-lg hover:bg-gray-100 ${isActive("/cart")}`}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="ml-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
