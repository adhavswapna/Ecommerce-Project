import {
  useEffect,
  useState,
} from "react";

import {
  getVendors,
  approveVendor,
  rejectVendor,
} from "../api/vendors";

export default function Vendors() {
  const [vendors, setVendors] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getVendors();

      setVendors(data);
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

  const approve = async (
    id: string
  ) => {
    try {
      await approveVendor(id);

      alert(
        "Vendor approved successfully."
      );

      await loadVendors();
    } catch (err: any) {
      console.error(
        "Approve vendor error:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Failed to approve vendor"
      );
    }
  };

  const reject = async (
    id: string
  ) => {
    try {
      await rejectVendor(id);

      alert(
        "Vendor rejected successfully."
      );

      await loadVendors();
    } catch (err: any) {
      console.error(
        "Reject vendor error:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Failed to reject vendor"
      );
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Vendor Approvals</h1>
        <p>Loading vendors...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Vendor Approvals</h1>

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {vendors.length === 0 && !error && (
        <p>No vendors found.</p>
      )}

      <div>
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "5px",
              background: "#fff",
            }}
          >
            <h3>
              {vendor.name}
            </h3>

            <p>
              Email: {vendor.email}
            </p>

            <p>
              Phone:{" "}
              {vendor.phone || "N/A"}
            </p>

            <p>
              Address:{" "}
              {vendor.address || "N/A"}
            </p>

            <p>
              User ID:{" "}
              {vendor.userId || "N/A"}
            </p>

            <p>
              Status:{" "}
              <strong>
                {vendor.status}
              </strong>
            </p>

            {vendor.status ===
              "PENDING" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() =>
                    approve(vendor.id)
                  }
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    reject(vendor.id)
                  }
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
