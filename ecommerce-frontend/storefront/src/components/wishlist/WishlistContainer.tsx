"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function WishlistContainer({ children, title = "My Wishlist" }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
