"use client";

import { useState } from "react";
import { CartItem } from "@/types/cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  return { items, addToCart };
}

