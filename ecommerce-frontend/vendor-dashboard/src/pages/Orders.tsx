import { useEffect, useState } from "react";
import { getVendorOrders } from "../api/orders";

export default function Orders() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data =
          await getVendorOrders();

        setOrders(data);
      } catch (err) {
        console.error(
          "Failed to load vendor orders:",
          err
        );

        setError(
          "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Orders
      </h1>

      {loading && (
        <p>Loading orders...</p>
      )}

      {error && (
        <p style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            No orders found.
          </div>
        )}

      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p>
              <strong>Order ID:</strong>{" "}
              {o.id}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {o.status}
            </p>

            <p>
              <strong>Total:</strong>{" "}
              ₹{o.total ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
