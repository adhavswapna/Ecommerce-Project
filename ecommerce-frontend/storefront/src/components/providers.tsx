"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/auth.store";

import { useLiveNotification } from "@/hooks/useLiveNotification";

import MobileNotificationPanel from "@/components/notifications/MobileNotificationPanel";


interface Props {
  children: React.ReactNode;
}


export default function Providers({
  children,
}: Props) {


  const hydrate =
    useAuthStore(
      (state) => state.hydrate
    );


  const hydrated =
    useAuthStore(
      (state) => state.hydrated
    );


  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );


  const fetchCart =
    useCartStore(
      (state) => state.fetchCart
    );


  const fetchWishlist =
    useWishlistStore(
      (state) => state.fetchWishlist
    );



  useLiveNotification();



  useEffect(() => {

    hydrate();

  }, [hydrate]);




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
    fetchWishlist
  ]);




  return (
    <>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />


      <MobileNotificationPanel />


      {children}

    </>
  );

}
