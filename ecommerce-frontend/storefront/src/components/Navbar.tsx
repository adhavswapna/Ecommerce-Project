"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function Navbar() {
  const router = useRouter();

  const { token, user, logout } = useAuthStore();

  const items = useCartStore((s) => s.items);
  const wishlist = useWishlistStore((s) => s.wishlist);

  const fetchCart = useCartStore((s) => s.fetchCart);
  const fetchWishlist = useWishlistStore(
    (s) => s.fetchWishlist
  );

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      fetchCart();
      fetchWishlist();
    }
  }, [token]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      close
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(
      `/products?search=${encodeURIComponent(
        search
      )}`
    );
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* TOP BAR */}

      <div className="bg-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* LOGO */}

          <Link
            href="/"
            className="text-2xl font-bold text-yellow-400 whitespace-nowrap"
          >
            ShopSphere
          </Link>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="flex flex-1 h-11"
          >
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="flex-1 px-4 text-black rounded-l-md outline-none"
            />

            <button
              type="submit"
              className="bg-yellow-400 text-black px-5 rounded-r-md font-bold"
            >
              🔍
            </button>
          </form>

          {/* DESKTOP LINKS */}

          <div className="hidden md:flex items-center gap-6">

            <Link
              href="/products"
              className="hover:text-yellow-400"
            >
              Products
            </Link>

            <Link
              href="/orders"
              className="hover:text-yellow-400"
            >
              Orders
            </Link>

            <Link
              href="/wishlist"
              className="relative hover:text-yellow-400"
            >
              ❤️ Wishlist

              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-xs px-2 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative hover:text-yellow-400"
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <NotificationDropdown />

            {token ? (
              <div
                className="relative"
                ref={menuRef}
              >
                <button
                  onClick={() =>
                    setMenuOpen(!menuOpen)
                  }
                  className="font-semibold"
                >
                  Hello,{" "}
                  {user?.name || "User"} ▼
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 bg-white text-black rounded-xl shadow-xl w-60 overflow-hidden">

                    <Link
                      href="/profile"
                      className="block p-4 hover:bg-gray-100"
                    >
                      👤 Profile
                    </Link>

                    <Link
                      href="/wishlist"
                      className="block p-4 hover:bg-gray-100"
                    >
                      ❤️ Wishlist
                    </Link>

                    <Link
                      href="/orders"
                      className="block p-4 hover:bg-gray-100"
                    >
                      📦 Orders
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        router.push("/login");
                      }}
                      className="w-full text-left p-4 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-md font-bold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY BAR */}

      <div className="hidden md:block bg-[#232f3e] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-8 text-sm">

          <Link href="/products">
            All Products
          </Link>

          <Link href="/products?category=electronics">
            Electronics
          </Link>

          <Link href="/products?category=fashion">
            Fashion
          </Link>

          <Link href="/products?category=home">
            Home
          </Link>

          <Link href="/products?category=beauty">
            Beauty
          </Link>

          <Link href="/products?category=sports">
            Sports
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}

      <div className="md:hidden bg-[#232f3e] text-white px-4 py-3 flex justify-between">

        <Link href="/products">
          Products
        </Link>

        <Link href="/wishlist">
          ❤️ {wishlist.length}
        </Link>

        <Link href="/cart">
          🛒 {cartCount}
        </Link>
      </div>
    </header>
  );
}
