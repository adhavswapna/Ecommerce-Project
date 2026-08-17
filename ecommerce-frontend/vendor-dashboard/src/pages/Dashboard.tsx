import { useEffect, useState } from "react";
import { getVendorAnalytics } from "../api/analytics";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userText =
    localStorage.getItem("vendorUser");

  let user: any = null;

  try {
    user = userText
      ? JSON.parse(userText)
      : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const result =
          await getVendorAnalytics();

        setData(result);
      } catch (err) {
        console.error(
          "Failed to load vendor analytics:",
          err
        );

        setError(
          "Unable to load dashboard statistics."
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
          marginBottom: "8px",
        }}
      >
        Vendor Dashboard
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "25px",
        }}
      >
        Welcome, {user?.name || "Vendor"}
      </p>

      {/* Vendor information */}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Vendor Information
        </h2>

        <p>
          <strong>Name:</strong>{" "}
          {user?.name || ""}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user?.email || ""}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {user?.role || ""}
        </p>
      </div>

      {/* Statistics */}

      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        Business Overview
      </h2>

      {loading && (
        <p>Loading dashboard...</p>
      )}

      {error && (
        <p
          style={{
            color: "#dc2626",
            marginBottom: "15px",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "20px",
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
              Total Sales
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "8px",
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
                marginTop: "8px",
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
              Total Products
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              {data.totalProducts ?? 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
