"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Refund {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  reason?: string;
  createdAt: string;
}

const API = process.env.NEXT_PUBLIC_REFUND_API || "http://localhost:3016";

export default function ReturnsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderId, setOrderId] = useState(""); // 🔥 user input

  const fetchRefunds = async () => {
    if (!orderId) {
      setError("Please enter Order ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${API}/refunds/order/${orderId}`
      );

      setRefunds(res.data || []);
    } catch (err: any) {
      console.error("Returns fetch error FULL:", err);
      setError(err?.response?.data?.message || err.message);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // optional auto-fetch if you want default order
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Returns / Refunds
      </h1>

      {/* 🔍 Search by Order ID */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <button
          onClick={fetchRefunds}
          style={{
            padding: "8px 12px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Fetch Refunds
        </button>
      </div>

      {/* 🔄 Loading */}
      {loading && <p>Loading refunds...</p>}

      {/* ❌ Error */}
      {error && (
        <div style={{ color: "red", marginBottom: "12px" }}>
          <p>{error}</p>
        </div>
      )}

      {/* 📭 Empty */}
      {!loading && !error && refunds.length === 0 && (
        <p>No refunds found.</p>
      )}

      {/* 📦 Table */}
      {!loading && refunds.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "16px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Refund ID</th>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund.id}>
                <td style={tdStyle}>{refund.id}</td>
                <td style={tdStyle}>{refund.orderId}</td>
                <td style={tdStyle}>₹{refund.amount}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: getStatusColor(refund.status),
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    {refund.status}
                  </span>
                </td>
                <td style={tdStyle}>{refund.reason || "-"}</td>
                <td style={tdStyle}>
                  {new Date(refund.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🎨 styles
const thStyle: React.CSSProperties = {
  borderBottom: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  background: "#f5f5f5",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "10px",
};

// 🎯 status color
function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "orange";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}
