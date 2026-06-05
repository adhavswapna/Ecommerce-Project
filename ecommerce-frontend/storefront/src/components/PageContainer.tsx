"use client";

import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {children}
    </main>
  );
}
