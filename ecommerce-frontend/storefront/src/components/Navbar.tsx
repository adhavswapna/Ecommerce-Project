"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        ShopSphere
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {/* Guest Links */}
        {!token && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {/* User Links */}
        {token && role === "USER" && (
          <>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">My Orders</Link>
            <Link href="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
