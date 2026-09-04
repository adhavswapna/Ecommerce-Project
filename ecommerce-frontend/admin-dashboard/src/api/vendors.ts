import apiClient from "./client";

/* =====================================================
   VENDOR TYPES
===================================================== */

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive?: boolean;
}

/* =====================================================
   GET ALL VENDORS
===================================================== */

export const getVendors = async () => {
  const { data } = await apiClient.get("/vendors");

  return data;
};

/* =====================================================
   APPROVE VENDOR
===================================================== */

export const approveVendor = async (id: string) => {
  if (!id) {
    throw new Error("Vendor ID is required.");
  }

  console.log(`🚀 Approving vendor: ${id}`);

  const { data } = await apiClient.post(
    `/vendors/${id}/approve`
  );

  console.log("✅ Vendor approved:", data);

  return data;
};

/* =====================================================
   REJECT VENDOR
===================================================== */

export const rejectVendor = async (id: string) => {
  if (!id) {
    throw new Error("Vendor ID is required.");
  }

  console.log(`🚀 Rejecting vendor: ${id}`);

  const { data } = await apiClient.post(
    `/vendors/${id}/reject`
  );

  console.log("✅ Vendor rejected:", data);

  return data;
};
