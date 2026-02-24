"use client";

import Link from "next/link";

export default function CartDrawer() {
  return (
    <Link href="/cart" className="font-semibold">
      Cart 🛍️
    </Link>
  );
}

