"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getRefunds,
} from "@/api/refunds";

export default function RefundsContainer() {
  const [
    refunds,
    setRefunds,
  ] = useState<any[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchRefunds =
      async () => {
        try {
          const data =
            await getRefunds();

          setRefunds(data);
        } catch (
          error
        ) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchRefunds();
  }, []);

  if (loading) {
    return (
      <div>
        Loading refunds...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {refunds.map(
        (refund) => (
          <div
            key={refund.id}
            className="bg-white border rounded-2xl p-6"
          >
            <p className="font-semibold">
              Refund #{refund.id}
            </p>

            <p className="mt-2 text-gray-500">
              {refund.reason}
            </p>

            <p className="mt-2">
              Status:
              {" "}
              {refund.status}
            </p>
          </div>
        )
      )}

    </div>
  );
}
