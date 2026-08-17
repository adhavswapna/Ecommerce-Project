import {
  PrismaClient,
  VendorStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

// =====================================================
// CREATE VENDOR PROFILE
// =====================================================

export async function createVendor(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId: string;
}) {
  return prisma.vendor.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,

      // User ID comes from Auth Service
      userId: data.userId,
    },
  });
}

// =====================================================
// LIST ALL VENDORS
// =====================================================

export async function listVendors() {
  return prisma.vendor.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// =====================================================
// GET VENDOR BY USER ID
// =====================================================
// Used when we have a logged-in user's JWT userId.
//
// User
//   ↓
// Vendor.userId
//
// =====================================================

export async function getVendorByUserId(userId: string) {
  return prisma.vendor.findFirst({
    where: {
      userId,
    },
  });
}

// =====================================================
// GET VENDOR BY VENDOR ID
// =====================================================
// Used by Product Service relationship:
//
// Vendor.id
//    ↓
// Product.vendorId
//
// =====================================================

export async function getVendorById(vendorId: string) {
  return prisma.vendor.findUnique({
    where: {
      id: vendorId,
    },
  });
}

// =====================================================
// UPDATE VENDOR STATUS
// =====================================================

export async function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
) {
  return prisma.vendor.update({
    where: {
      id: vendorId,
    },

    data: {
      status,
    },
  });
}
