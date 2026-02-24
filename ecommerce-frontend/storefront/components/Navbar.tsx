"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  // Safely get cart and wishlist counts
  const cartCount = useCartStore((state) => state.items?.length ?? 0);
  const wishlistCount = useWishlistStore((state) => state.items?.length ?? 0);

  if (loading) return null; // prevent flicker

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Storefront
          </Link>

          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>

          {user && (
            <>
              <Link href="/cart" className="hover:text-blue-600">
                Cart ({cartCount})
              </Link>

              <Link href="/orders" className="hover:text-blue-600">
                Orders
              </Link>

              <Link href="/wishlist" className="hover:text-blue-600">
                ❤️ Wishlist ({wishlistCount})
              </Link>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-700">
                Hi, <strong>{user.name}</strong>
              </span>

              <button
                onClick={logout}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

