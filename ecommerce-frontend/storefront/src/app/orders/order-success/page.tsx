import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 text-center">

      <div className="bg-white border rounded-3xl p-12">

        <div className="text-6xl">
          🎉
        </div>

        <h1 className="mt-6 text-5xl font-bold">
          Order Successful
        </h1>

        <p className="mt-4 text-gray-500">
          Your order has been placed successfully.
        </p>

        <Link
          href="/orders"
          className="inline-block mt-10 bg-black text-white px-6 py-3 rounded-xl"
        >
          View Orders
        </Link>

      </div>

    </main>
  );
}
