"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useLiveNotification } from "@/hooks/useLiveNotification";
import MobileNotificationPanel from "@/components/notifications/MobileNotificationPanel";

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useLiveNotification();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchCart();
      fetchWishlist();
    }
  }, [fetchCart, fetchWishlist]);

  return (
    <>
      <Toaster position="top-right" />
      <MobileNotificationPanel />
      {children}
    </>
  );
}
