// src/components/Navbar.tsx

"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useAuthStore,
} from "@/store/auth.store";

import {
  useCartStore,
} from "@/store/cartStore";

import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function Navbar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    token,
    logout,
  } = useAuthStore();

  /**
   * 🛒 CART STATE
   */
  const cartItems =
    useCartStore(
      (state) =>
        state.cartItems
    ) || [];

  /**
   * 🔢 CART COUNT
   */
  const cartCount =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  const [mounted, setMounted] =
    useState(false);

  const [
    showDropdown,
    setShowDropdown,
  ] = useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  /**
   * 🛒 FETCH CART ON LOAD
   */
  const fetchCart =
    useCartStore(
      (state) =>
        state.fetchCart
    );

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  /**
   * 👇 CLOSE DROPDOWN
   */
  useEffect(() => {
    const handleClickOutside =
      (
        event: MouseEvent
      ) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target as Node
          )
        ) {
          setShowDropdown(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /**
   * 👤 USER FROM JWT
   */
  const user = useMemo(() => {
    if (!token) {
      return null;
    }

    try {
      return JSON.parse(
        atob(
          token.split(".")[1]
        )
      );
    } catch {
      return null;
    }
  }, [token]);

  /**
   * 🚪 LOGOUT
   */
  const handleLogout =
    () => {
      logout();

      router.push(
        "/login"
      );
    };

  /**
   * 🎨 ACTIVE LINK
   */
  const isActive = (
    path: string
  ) =>
    pathname === path
      ? "font-semibold text-blue-600"
      : "text-gray-600 hover:text-blue-600";

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          ShopSphere
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm">

          {!token ? (
            <>
              <Link
                href="/"
                className={isActive(
                  "/"
                )}
              >
                Home
              </Link>

              <Link
                href="/products"
                className={isActive(
                  "/products"
                )}
              >
                Products
              </Link>

              <Link
                href="/login"
                className={isActive(
                  "/login"
                )}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/products"
                className={isActive(
                  "/products"
                )}
              >
                Products
              </Link>

              {/* CART */}
              <Link
                href="/cart"
                className={`${isActive(
                  "/cart"
                )} relative`}
              >
                🛒 Cart

                {cartCount >
                  0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {
                      cartCount
                    }
                  </span>
                )}
              </Link>

              {/* ORDERS */}
              <Link
                href="/orders"
                className={isActive(
                  "/orders"
                )}
              >
                📦 Orders
              </Link>

              {/* WISHLIST */}
              <Link
                href="/wishlist"
                className={isActive(
                  "/wishlist"
                )}
              >
                ❤️ Wishlist
              </Link>

              {/* NOTIFICATIONS */}
              <NotificationDropdown />

              {/* USER MENU */}
              <div
                className="relative"
                ref={
                  dropdownRef
                }
              >
                <button
                  onClick={() =>
                    setShowDropdown(
                      (
                        prev
                      ) =>
                        !prev
                    )
                  }
                  className="font-medium hover:text-blue-600"
                >
                  Hello,{" "}
                  {user?.name ||
                    "User"}{" "}
                  ▼
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border rounded-2xl shadow-xl overflow-hidden">

                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">
                        {
                          user?.name
                        }
                      </p>

                      <p className="text-xs text-gray-500 break-all">
                        {
                          user?.email
                        }
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Orders
                    </Link>

                    <Link
                      href="/wishlist"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Wishlist
                    </Link>

                    <button
                      onClick={
                        handleLogout
                      }
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
