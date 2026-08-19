import apiClient from "./client";

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
  const { data } = await apiClient.post(
    `/vendors/${id}/approve`
  );

  return data;
};

/* =====================================================
   REJECT VENDOR
===================================================== */

export const rejectVendor = async (id: string) => {
  const { data } = await apiClient.post(
    `/vendors/${id}/reject`
  );

  return data;
};

/* =====================================================
   CREATE VENDOR AUTH ACCOUNT
===================================================== */

export interface CreateVendorAuthInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface CreateVendorAuthResponse {
  success?: boolean;
  userId?: string;
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  message?: string;
}

/* =====================================================
   CREATE AUTH ACCOUNT
===================================================== */

export const createVendorAuth = async (
  vendor: CreateVendorAuthInput
): Promise<CreateVendorAuthResponse> => {
  const { data } = await apiClient.post(
    "/auth/register/vendor",
    {
      name: vendor.name,
      email: vendor.email,
      password: vendor.password,
      phone: vendor.phone,
      address: vendor.address,
    }
  );

  return data;
};

/* =====================================================
   CREATE VENDOR PROFILE
===================================================== */

export interface CreateVendorProfileInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId: string;
}

export interface CreateVendorProfileResponse {
  success?: boolean;
  data?: unknown;
  vendor?: unknown;
  message?: string;
}

export const createVendorProfile = async (
  vendor: CreateVendorProfileInput
): Promise<CreateVendorProfileResponse> => {
  const { data } = await apiClient.post(
    "/vendors/create",
    {
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      userId: vendor.userId,
    }
  );

  return data;
};

/* =====================================================
   CREATE COMPLETE VENDOR
===================================================== */

export const createVendor = async (
  vendor: CreateVendorAuthInput
) => {
  /* ---------------------------------------------------
     STEP 1
     Create authentication account
  --------------------------------------------------- */

  console.log(
    "=============================================="
  );

  console.log(
    "🚀 STEP 1: Creating vendor authentication account..."
  );

  const authResponse = await createVendorAuth({
    name: vendor.name,
    email: vendor.email,
    password: vendor.password,
    phone: vendor.phone,
    address: vendor.address,
  });

  console.log(
    "✅ Auth Service Response:",
    authResponse
  );

  /* ---------------------------------------------------
     IMPORTANT

     Auth Service response is expected to be:

     {
       success: true,
       userId: "...",
       token: "...",
       user: {}
     }

     Therefore userId is directly under authResponse.
  --------------------------------------------------- */

  const userId = authResponse?.userId;

  console.log(
    "👤 Auth User ID:",
    userId
  );

  if (!userId) {
    throw new Error(
      "Auth Service did not return userId."
    );
  }

  /* ---------------------------------------------------
     STEP 2
     Create vendor business profile
  --------------------------------------------------- */

  console.log(
    "=============================================="
  );

  console.log(
    "🚀 STEP 2: Creating vendor profile..."
  );

  console.log(
    "Vendor profile payload:",
    {
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      userId,
    }
  );

  const vendorResponse =
    await createVendorProfile({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      userId,
    });

  console.log(
    "✅ Vendor Service Response:",
    vendorResponse
  );

  console.log(
    "=============================================="
  );

  console.log(
    "🎉 COMPLETE VENDOR CREATION SUCCESSFUL"
  );

  return {
    auth: authResponse,
    vendor: vendorResponse,
    userId,
  };
};
