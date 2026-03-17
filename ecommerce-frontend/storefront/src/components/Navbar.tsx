"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";

export default function Navbar() {
  const { token, role, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ userId?: string; name?: string } | null>(
    null
  );

  const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

  const isActive = (path: string) => ({
    fontWeight: pathname === path ? "bold" : "normal",
    textDecoration: pathname === path ? "underline" : "none",
  });

  const parseToken = () => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const payload = parseToken();
    setUser(payload);
  }, [token]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user?.userId || role !== "USER") return;

      try {
        const res = await api.get(`${CART_API}/cart/${user.userId}`);
        const total = res.data.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(total);
      } catch (err) {
        console.error("Cart fetch failed:", err);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, [user, role]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
        padding: "14px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        ShopSphere
      </Link>

      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        {!token && (
          <>
            <Link href="/" style={isActive("/")}>Home</Link>
            <Link href="/products" style={isActive("/products")}>Products</Link>
            <Link href="/search" style={isActive("/search")}>Search</Link>
            <Link href="/login" style={isActive("/login")}>Login</Link>
            <Link href="/register" style={isActive("/register")}>Register</Link>
          </>
        )}

        {token && role === "USER" && (
          <>
            <span style={{ fontWeight: 500 }}>Hi, {user?.name || "User"} 👋</span>
            <Link href="/" style={isActive("/")}>Home</Link>
            <Link href="/products" style={isActive("/products")}>Products</Link>
            <Link href="/search" style={isActive("/search")}>Search</Link>
            <Link href="/cart" style={isActive("/cart")}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link href="/orders" style={isActive("/orders")}>Orders</Link>
            <Link href="/invoices" style={isActive("/invoices")}>Invoices</Link>
            <Link href="/profile" style={isActive("/profile")}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {token && role === "VENDOR" && (
          <>
            <Link href="/vendor/dashboard" style={isActive("/vendor/dashboard")}>Dashboard</Link>
            <Link href="/vendor/products" style={isActive("/vendor/products")}>Products</Link>
            <Link href="/vendor/inventory" style={isActive("/vendor/inventory")}>Inventory</Link>
            <Link href="/vendor/orders" style={isActive("/vendor/orders")}>Orders</Link>
            <Link href="/vendor/analytics" style={isActive("/vendor/analytics")}>Analytics</Link>
            <Link href="/vendor/profile" style={isActive("/vendor/profile")}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {token && role === "ADMIN" && (
          <>
            <Link href="/admin/dashboard" style={isActive("/admin/dashboard")}>Dashboard</Link>
            <Link href="/admin/users" style={isActive("/admin/users")}>Users</Link>
            <Link href="/admin/vendors" style={isActive("/admin/vendors")}>Vendors</Link>
            <Link href="/admin/products" style={isActive("/admin/products")}>Products</Link>
            <Link href="/admin/orders" style={isActive("/admin/orders")}>Orders</Link>
            <Link href="/admin/analytics" style={isActive("/admin/analytics")}>Analytics</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
