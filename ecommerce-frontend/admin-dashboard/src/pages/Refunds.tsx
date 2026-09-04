
import { useEffect, useState } from "react";
import {
  getRefunds,
  approveRefund,
} from "../api/refunds";

interface Refund {
  id: string;
  orderId?: string;
  userId?: string;
  amount?: number;
  reason?: string;
  status?: string;
  createdAt?: string;
}

export default function Refunds() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  /* =====================================================
     LOAD REFUNDS
  ===================================================== */

  const loadRefunds = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRefunds();

      /*
       * Support:
       *
       * [
       *   {...}
       * ]
       *
       * or:
       *
       * {
       *   data: [...]
       * }
       */

      const refundData = Array.isArray(response)
        ? response
        : response?.data;

      setRefunds(
        Array.isArray(refundData)
          ? refundData
          : []
      );
    } catch (err: any) {
      console.error(
        "❌ Failed to load refunds:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load refunds"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  /* =====================================================
     APPROVE REFUND
  ===================================================== */

  const approve = async (refund: Refund) => {
    const confirmed = window.confirm(
      `Approve refund${refund.orderId ? ` for order ${refund.orderId}` : ""}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(refund.id);
      setError("");

      await approveRefund(refund.id);

      alert("Refund approved successfully.");

      await loadRefunds();
    } catch (err: any) {
      console.error(
        "❌ Approve refund failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to approve refund"
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section>
        <h1>Refund Management</h1>
        <p>Loading refunds...</p>
      </section>
    );
  }

  /* =====================================================
     COUNTS
  ===================================================== */

  const pendingCount = refunds.filter(
    (refund) =>
      refund.status === "PENDING"
  ).length;

  const approvedCount = refunds.filter(
    (refund) =>
      refund.status === "APPROVED"
  ).length;

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (
    status?: string
  ): React.CSSProperties => {
    switch (status) {
      case "APPROVED":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
        };

      case "REJECTED":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        };

      case "PENDING":
      default:
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
        };
    }
  };

  return (
    <section
      style={{
        marginTop: "30px",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>Refund Management</h1>

          <p
            style={{
              color: "#666",
            }}
          >
            Review and manage customer refund requests.
          </p>
        </div>

        <button
          onClick={loadRefunds}
          style={{
            padding: "10px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, 1fr)",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            padding: "18px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <div
            style={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            Pending Refunds
          </div>

          <strong
            style={{
              fontSize: "28px",
            }}
          >
            {pendingCount}
          </strong>
        </div>

        <div
          style={{
            padding: "18px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <div
            style={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            Approved Refunds
          </div>

          <strong
            style={{
              fontSize: "28px",
            }}
          >
            {approvedCount}
          </strong>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding: "12px 15px",
            marginBottom: "20px",
            borderRadius: "6px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {refunds.length === 0 && (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <h3>No refunds found</h3>

          <p
            style={{
              color: "#666",
            }}
          >
            There are currently no refund requests.
          </p>
        </div>
      )}

      {/* =================================================
          REFUND LIST
      ================================================= */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {refunds.map((refund) => {
          const processing =
            processingId === refund.id;

          return (
            <div
              key={refund.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              {/* Header */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 5px 0",
                    }}
                  >
                    Refund Request
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                    }}
                  >
                    ID: {refund.id}
                  </p>
                </div>

                <span
                  style={{
                    ...getStatusStyle(
                      refund.status
                    ),
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {refund.status || "PENDING"}
                </span>
              </div>

              {/* Details */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <strong>Order ID:</strong>{" "}
                  {refund.orderId || "N/A"}
                </div>

                <div>
                  <strong>User ID:</strong>{" "}
                  {refund.userId || "N/A"}
                </div>

                <div>
                  <strong>Amount:</strong>{" "}
                  {refund.amount !== undefined
                    ? `₹${refund.amount}`
                    : "N/A"}
                </div>

                <div>
                  <strong>Date:</strong>{" "}
                  {refund.createdAt
                    ? new Date(
                        refund.createdAt
                      ).toLocaleString()
                    : "N/A"}
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <strong>Reason:</strong>{" "}
                  {refund.reason || "N/A"}
                </div>
              </div>

              {/* Action */}

              {refund.status === "PENDING" && (
                <div
                  style={{
                    paddingTop: "15px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <button
                    onClick={() =>
                      approve(refund)
                    }
                    disabled={processing}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#16a34a",
                      color: "#fff",
                      cursor: processing
                        ? "not-allowed"
                        : "pointer",
                      opacity: processing
                        ? 0.6
                        : 1,
                      fontWeight: "600",
                    }}
                  >
                    {processing
                      ? "Processing..."
                      : "Approve Refund"}
                  </button>
                </div>
              )}

              {refund.status === "APPROVED" && (
                <div
                  style={{
                    paddingTop: "15px",
                    borderTop: "1px solid #eee",
                    color: "#166534",
                    fontWeight: "600",
                  }}
                >
                  ✓ Refund approved
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

