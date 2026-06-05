"use client";

import RefundsContainer from "@/components/returns/RefundsContainer";

export default function ReturnsPage() {
  return (
    <main className="max-w-6xl mx-auto py-10">

      <h1 className="text-4xl font-bold">
        Returns & Refunds
      </h1>

      <div className="mt-10">
        <RefundsContainer />
      </div>

    </main>
  );
}
