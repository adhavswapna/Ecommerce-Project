import { PrismaClient, VendorStatus } from "@prisma/client";

const prisma = new PrismaClient();

// ----------------------
// Create Vendor
// ----------------------
export async function createVendor(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId?: string;
}) {
  return prisma.vendor.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      userId: data.userId,
    },
  });
}

// ----------------------
// List Vendors
// ----------------------
export async function listVendors() {
  return prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ----------------------
// Update Vendor Status
// ----------------------
export async function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: { status },
  });
}
