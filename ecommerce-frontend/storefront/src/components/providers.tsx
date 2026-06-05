// src/components/providers.tsx

"use client";

import {
  useEffect,
} from "react";

import {
  Toaster,
} from "react-hot-toast";

import {
  useCartStore,
} from "@/store/cartStore";

import {
  useWishlistStore,
} from "@/store/wishlistStore";

import {
  useAuthStore,
} from "@/store/auth.store";

import {
  useLiveNotification,
} from "@/hooks/useLiveNotification";

import MobileNotificationPanel from "@/components/notifications/MobileNotificationPanel";

interface Props {
  children: React.ReactNode;
}

export default function Providers({
  children,
}: Props) {
  /* =========================================
   * 🧠 AUTH STORE
   * ========================================= */
  const hydrate =
    useAuthStore(
      (state) =>
        state.hydrate
    );

  const hydrated =
    useAuthStore(
      (state) =>
        state.hydrated
    );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  /* =========================================
   * 🛒 CART STORE
   * ========================================= */
  const fetchCart =
    useCartStore(
      (state) =>
        state.fetchCart
    );

  /* =========================================
   * ❤️ WISHLIST STORE
   * ========================================= */
  const fetchWishlist =
    useWishlistStore(
      (state) =>
        state.fetchWishlist
    );

  /* =========================================
   * 🔔 LIVE NOTIFICATIONS
   * ========================================= */
  useLiveNotification();

  /* =========================================
   * 💧 HYDRATE AUTH ON APP START
   * ========================================= */
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  /* =========================================
   * 📦 LOAD USER DATA
   * ========================================= */
  useEffect(() => {
    if (
      hydrated &&
      isAuthenticated
    ) {
      fetchCart();

      fetchWishlist();
    }
  }, [
    hydrated,
    isAuthenticated,
    fetchCart,
    fetchWishlist,
  ]);

  return (
    <>
      {/* =========================================
       * 🔥 TOAST
       * ========================================= */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius:
              "12px",

            padding:
              "12px 16px",

            fontSize:
              "14px",
          },
        }}
      />

      {/* =========================================
       * 📱 MOBILE NOTIFICATIONS
       * ========================================= */}
      <MobileNotificationPanel />

      {/* =========================================
       * 🌍 APP
       * ========================================= */}
      {children}
    </>
  );
}
