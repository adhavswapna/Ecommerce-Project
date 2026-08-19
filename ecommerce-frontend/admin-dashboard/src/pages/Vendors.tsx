import {
  useEffect,
  useState,
} from "react";

import {
  getVendors,
  approveVendor,
  rejectVendor,
} from "../api/vendors";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId?: string;
  status: string;
  isActive?: boolean;
}

export default function Vendors() {
  const [vendors, setVendors] =
    useState<Vendor[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVendors();

      /*
       * Support both:
       *
       * [
       *   {...}
       * ]
       *
       * and:
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       */

      const vendorData =
        Array.isArray(response)
          ? response
          : response?.data;

      setVendors(
        Array.isArray(vendorData)
          ? vendorData
          : []
      );
    } catch (err: any) {
      console.error(
        "Failed to load vendors:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  /* =====================================================
     APPROVE
  ===================================================== */

  const approve = async (vendor: Vendor) => {
    const confirmed = window.confirm(
      `Approve vendor "${vendor.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(vendor.id);
      setError("");

      await approveVendor(vendor.id);

      alert(
        `Vendor "${vendor.name}" approved successfully.`
      );

      await loadVendors();
    } catch (err: any) {
      console.error(
        "Approve vendor error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to approve vendor"
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* =====================================================
     REJECT
  ===================================================== */

  const reject = async (vendor: Vendor) => {
    const confirmed = window.confirm(
      `Reject vendor "${vendor.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(vendor.id);
      setError("");

      await rejectVendor(vendor.id);

      alert(
        `Vendor "${vendor.name}" rejected successfully.`
      );

      await loadVendors();
    } catch (err: any) {
      console.error(
        "Reject vendor error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to reject vendor"
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
      <section
        style={{
          marginTop: "30px",
        }}
      >
        <h1>Vendor Management</h1>

        <p>
          Loading vendors...
        </p>
      </section>
    );
  }

  /* =====================================================
     COUNTS
  ===================================================== */

  const pendingCount =
    vendors.filter(
      (vendor) =>
        vendor.status === "PENDING"
    ).length;

  const approvedCount =
    vendors.filter(
      (vendor) =>
        vendor.status === "APPROVED"
    ).length;

  const rejectedCount =
    vendors.filter(
      (vendor) =>
        vendor.status === "REJECTED"
    ).length;

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (
    status: string
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
          <h1
            style={{
              marginBottom: "5px",
            }}
          >
            Vendor Management
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: 0,
            }}
          >
            Review and manage vendor applications.
          </p>
        </div>

        <button
          onClick={loadVendors}
          disabled={loading}
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
            "repeat(3, 1fr)",
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
            Pending
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
            Approved
          </div>

          <strong
            style={{
              fontSize: "28px",
            }}
          >
            {approvedCount}
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
            Rejected
          </div>

          <strong
            style={{
              fontSize: "28px",
            }}
          >
            {rejectedCount}
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

      {vendors.length === 0 && (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <h3>
            No vendors found
          </h3>

          <p
            style={{
              color: "#666",
            }}
          >
            There are currently no vendor
            applications.
          </p>
        </div>
      )}

      {/* =================================================
          VENDOR LIST
      ================================================= */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {vendors.map((vendor) => {
          const processing =
            processingId === vendor.id;

          return (
            <div
              key={vendor.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "8px",
                background: "#fff",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {/* Vendor header */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
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
                    {vendor.name}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                    }}
                  >
                    {vendor.email}
                  </p>
                </div>

                <span
                  style={{
                    ...getStatusStyle(
                      vendor.status
                    ),
                    padding:
                      "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {vendor.status}
                </span>
              </div>

              {/* Vendor information */}

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
                  <strong>
                    Phone:
                  </strong>{" "}
                  {vendor.phone ||
                    "N/A"}
                </div>

                <div>
                  <strong>
                    User ID:
                  </strong>{" "}
                  {vendor.userId ||
                    "N/A"}
                </div>

                <div
                  style={{
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <strong>
                    Address:
                  </strong>{" "}
                  {vendor.address ||
                    "N/A"}
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              {vendor.status ===
                "PENDING" && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    paddingTop: "15px",
                    borderTop:
                      "1px solid #eee",
                  }}
                >
                  <button
                    onClick={() =>
                      approve(vendor)
                    }
                    disabled={processing}
                    style={{
                      padding:
                        "10px 20px",
                      border: "none",
                      borderRadius:
                        "6px",
                      background:
                        "#16a34a",
                      color: "#fff",
                      cursor: processing
                        ? "not-allowed"
                        : "pointer",
                      opacity:
                        processing
                          ? 0.6
                          : 1,
                      fontWeight: "600",
                    }}
                  >
                    {processing
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    onClick={() =>
                      reject(vendor)
                    }
                    disabled={processing}
                    style={{
                      padding:
                        "10px 20px",
                      border: "none",
                      borderRadius:
                        "6px",
                      background:
                        "#dc2626",
                      color: "#fff",
                      cursor: processing
                        ? "not-allowed"
                        : "pointer",
                      opacity:
                        processing
                          ? 0.6
                          : 1,
                      fontWeight: "600",
                    }}
                  >
                    {processing
                      ? "Processing..."
                      : "Deny"}
                  </button>
                </div>
              )}

              {/* Approved */}

              {vendor.status ===
                "APPROVED" && (
                <div
                  style={{
                    paddingTop: "15px",
                    borderTop:
                      "1px solid #eee",
                    color: "#166534",
                    fontWeight: "600",
                  }}
                >
                  ✓ Vendor is approved
                </div>
              )}

              {/* Rejected */}

              {vendor.status ===
                "REJECTED" && (
                <div
                  style={{
                    paddingTop: "15px",
                    borderTop:
                      "1px solid #eee",
                    color: "#991b1b",
                    fontWeight: "600",
                  }}
                >
                  ✕ Vendor application rejected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
