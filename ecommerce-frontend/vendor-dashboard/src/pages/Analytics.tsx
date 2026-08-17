import { useEffect, useState } from "react";
import { getVendorAnalytics } from "../api/analytics";

export default function Analytics() {
  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result =
          await getVendorAnalytics();

        setData(result);
      } catch (err) {
        console.error(
          "Failed to load analytics:",
          err
        );

        setError(
          "Unable to load analytics."
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
        Analytics
      </h1>

      {loading && (
        <p>Loading analytics...</p>
      )}

      {error && (
        <p style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {!loading && !error && data && (
        <div
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
              }}
            >
              Total Revenue
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ₹{data.totalSales ?? 0}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
              }}
            >
              Total Orders
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {data.totalOrders ?? 0}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
              }}
            >
              Conversion Rate
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {data.conversionRate ?? 0}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
