"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";
import { getMe } from "@/api/user";

import ProductList from "@/components/product/ProductList";

export default function HomePage() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, logout]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* ================= HERO ================= */}

      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start px-8 py-20">

          <h1 className="text-5xl font-bold">
            {user
              ? `Welcome, ${user.name}`
              : "Welcome to ShopEase"}
          </h1>

          <p className="mt-5 max-w-2xl text-xl">
            Discover millions of products with fast delivery,
            secure payments and trusted sellers.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/products"
              className="rounded-full bg-yellow-400 px-10 py-4 font-bold text-black transition hover:bg-yellow-500"
            >
              Shop Now
            </Link>

            {!user && (
              <Link
                href="/login"
                className="rounded-full border border-white px-10 py-4 font-bold transition hover:bg-white hover:text-blue-900"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="mx-auto grid max-w-7xl gap-6 p-8 md:grid-cols-4">

        {[
          {
            name: "Electronics",
            emoji: "💻",
          },
          {
            name: "Fashion",
            emoji: "👕",
          },
          {
            name: "Home",
            emoji: "🏠",
          },
          {
            name: "Beauty",
            emoji: "💄",
          },
        ].map((category) => (
          <div
            key={category.name}
            className="cursor-pointer rounded-2xl bg-white p-8 shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              {category.emoji}
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {category.name}
            </h2>

            <p className="mt-2 text-gray-500">
              Explore now
            </p>
          </div>
        ))}

      </section>

      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="mx-auto max-w-7xl px-8 py-6">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>

          <Link
            href="/products"
            className="font-semibold text-blue-600 hover:underline"
          >
            View All →
          </Link>

        </div>

        <ProductList />

      </section>
      {/* ================= TODAY'S DEALS ================= */}

      <section className="mx-auto max-w-7xl px-8 py-10">

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="text-3xl font-bold">
            Today's Deals 🔥
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl border p-6 transition hover:shadow-lg">
              <div className="mb-4 text-5xl">
                💻
              </div>

              <h3 className="text-xl font-bold">
                Up to 50% OFF
              </h3>

              <p className="mt-2 text-gray-600">
                Electronics, laptops, mobiles and accessories.
              </p>
            </div>

            <div className="rounded-xl border p-6 transition hover:shadow-lg">
              <div className="mb-4 text-5xl">
                🚚
              </div>

              <h3 className="text-xl font-bold">
                Free Delivery
              </h3>

              <p className="mt-2 text-gray-600">
                Fast shipping on selected products across India.
              </p>
            </div>

            <div className="rounded-xl border p-6 transition hover:shadow-lg">
              <div className="mb-4 text-5xl">
                🔄
              </div>

              <h3 className="text-xl font-bold">
                Easy Returns
              </h3>

              <p className="mt-2 text-gray-600">
                Simple replacement and return policy.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= WHY SHOP WITH US ================= */}

      <section className="mx-auto max-w-7xl px-8 pb-10">

        <h2 className="mb-8 text-center text-3xl font-bold">
          Why Shop With Us?
        </h2>

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <div className="text-5xl">⭐</div>

            <h3 className="mt-4 text-xl font-bold">
              Top Quality
            </h3>

            <p className="mt-2 text-gray-600">
              Premium products from trusted sellers.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <div className="text-5xl">🔒</div>

            <h3 className="mt-4 text-xl font-bold">
              Secure Payment
            </h3>

            <p className="mt-2 text-gray-600">
              Multiple secure payment options.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <div className="text-5xl">⚡</div>

            <h3 className="mt-4 text-xl font-bold">
              Fast Delivery
            </h3>

            <p className="mt-2 text-gray-600">
              Quick delivery with live order tracking.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <div className="text-5xl">💬</div>

            <h3 className="mt-4 text-xl font-bold">
              24/7 Support
            </h3>

            <p className="mt-2 text-gray-600">
              Always here to help our customers.
            </p>
          </div>

        </div>

      </section>
      {/* ================= ACCOUNT ================= */}

      <section className="mx-auto max-w-7xl px-8 pb-12">

        {user ? (
          <div className="rounded-2xl bg-white p-8 shadow">

            <h2 className="text-2xl font-bold">
              Your Account
            </h2>

            <div className="mt-6 space-y-3">

              <p>
                <span className="font-semibold">
                  Name:
                </span>{" "}
                {user.name}
              </p>

              <p>
                <span className="font-semibold">
                  Email:
                </span>{" "}
                {user.email}
              </p>

              <p>
                <span className="font-semibold">
                  Role:
                </span>{" "}
                {user.role}
              </p>

            </div>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/profile"
                className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                My Profile
              </Link>

              <Link
                href="/orders"
                className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                My Orders
              </Link>

              <button
                onClick={() => {
                  logout();
                  setUser(null);
                }}
                className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>

            </div>

          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow">

            <h2 className="text-3xl font-bold">
              Join ShopEase
            </h2>

            <p className="mt-4 text-gray-600">
              Sign in to save your cart, place orders,
              track deliveries and manage your account.
            </p>

            <div className="mt-8 flex justify-center gap-4">

              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Create Account
              </Link>

            </div>

          </div>
        )}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="mt-10 bg-gray-900 py-12 text-white">

        <div className="mx-auto max-w-7xl px-8">

          <h2 className="text-3xl font-bold">
            ShopEase
          </h2>

          <p className="mt-4 max-w-2xl text-gray-300">
            Your one-stop destination for electronics,
            fashion, home essentials, beauty products
            and much more.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-3">

            <div>
              <h3 className="font-bold">
                Shop
              </h3>

              <ul className="mt-3 space-y-2 text-gray-300">
                <li>Electronics</li>
                <li>Fashion</li>
                <li>Home</li>
                <li>Beauty</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">
                Customer Service
              </h3>

              <ul className="mt-3 space-y-2 text-gray-300">
                <li>Help Center</li>
                <li>Returns</li>
                <li>Shipping</li>
                <li>Track Order</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">
                Contact
              </h3>

              <ul className="mt-3 space-y-2 text-gray-300">
                <li>Email: support@shopease.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Available 24 × 7</li>
              </ul>
            </div>

          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400">
            © 2026 ShopEase. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}
