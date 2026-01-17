import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createVendor(name: string, email: string) {
  return prisma.vendor.create({
    data: { name, email },
  });
}

export async function listVendors() {
  return prisma.vendor.findMany();
}

export async function updateVendorStatus(vendorId: string, isActive: boolean) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: { isActive },
  });
}
