
import prisma from "../db/prisma/prisma";
import { VendorStatus } from "@prisma/client";

/* =========================================================
   CREATE VENDOR
========================================================= */

export async function createVendor(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId: string;
}) {
  try {
    if (!data.name || !data.email || !data.userId) {
      throw new Error(
        "Name, email and userId are required"
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        address: data.address ?? null,
        userId: data.userId,
      },
    });

    console.log(
      "✅ Vendor created:",
      {
        id: vendor.id,
        userId: vendor.userId,
        status: vendor.status,
        isActive: vendor.isActive,
      }
    );

    return vendor;
  } catch (error) {
    console.error(
      "❌ Error creating vendor:",
      error
    );

    throw error;
  }
}


/* =========================================================
   LIST ALL VENDORS
========================================================= */

export async function listVendors() {
  try {
    const vendors =
      await prisma.vendor.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      `✅ Found ${vendors.length} vendor(s)`
    );

    return vendors;
  } catch (error) {
    console.error(
      "❌ Error listing vendors:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET APPROVED + ACTIVE VENDORS FOR USER
========================================================= */

/*
 * JWT userId
 *      ↓
 * Vendor.userId
 *      ↓
 * status = APPROVED
 *      ↓
 * isActive = true
 *      ↓
 * vendor.id
 *
 * IMPORTANT:
 *
 * Products use Vendor.id as Product.vendorId.
 *
 * We NEVER:
 *
 * - search by email
 * - search by name
 * - use JWT name
 * - return all vendors
 */

export async function getVendorsByUserId(
  userId: string
) {
  try {
    console.log(
      "🔎 Finding vendors for userId:",
      userId
    );

    if (
      !userId ||
      userId.trim() === ""
    ) {
      throw new Error(
        "User ID is required"
      );
    }

    const vendors =
      await prisma.vendor.findMany({
        where: {
          userId: userId,

          status: VendorStatus.APPROVED,

          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      `✅ Found ${vendors.length} approved active vendor(s) for user ${userId}`
    );

    console.log(
      "🔥 Vendors:",
      vendors.map(
        (vendor) => ({
          id: vendor.id,
          userId: vendor.userId,
          name: vendor.name,
          email: vendor.email,
          status: vendor.status,
          isActive: vendor.isActive,
        })
      )
    );

    return vendors;

  } catch (error) {
    console.error(
      "❌ Error finding vendors by userId:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET SINGLE APPROVED + ACTIVE VENDOR
========================================================= */

export async function getActiveVendorByUserId(
  userId: string
) {
  try {
    console.log(
      "🔎 Finding active vendor for userId:",
      userId
    );

    if (
      !userId ||
      userId.trim() === ""
    ) {
      throw new Error(
        "User ID is required"
      );
    }

    const vendor =
      await prisma.vendor.findFirst({
        where: {
          userId: userId,

          status: VendorStatus.APPROVED,

          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    if (!vendor) {
      throw new Error(
        "Approved active vendor profile not found for this user"
      );
    }

    console.log(
      "✅ Active vendor found:",
      {
        id: vendor.id,
        userId: vendor.userId,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status,
        isActive: vendor.isActive,
      }
    );

    return vendor;

  } catch (error) {
    console.error(
      "❌ Error finding active vendor:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET VENDOR BY ID
========================================================= */

export async function getVendorById(
  id: string
) {
  try {
    if (!id) {
      throw new Error(
        "Vendor ID is required"
      );
    }

    const vendor =
      await prisma.vendor.findUnique({
        where: {
          id,
        },
      });

    return vendor;

  } catch (error) {
    console.error(
      "❌ Error finding vendor by ID:",
      error
    );

    throw error;
  }
}


/* =========================================================
   UPDATE VENDOR STATUS
========================================================= */

export async function updateVendorStatus(
  id: string,
  status: VendorStatus
) {
  try {
    if (!id) {
      throw new Error(
        "Vendor ID is required"
      );
    }

    const vendor =
      await prisma.vendor.update({
        where: {
          id,
        },

        data: {
          status,
        },
      });

    console.log(
      "✅ Vendor status updated:",
      {
        id: vendor.id,
        status: vendor.status,
        isActive: vendor.isActive,
      }
    );

    return vendor;

  } catch (error) {
    console.error(
      "❌ Error updating vendor status:",
      error
    );

    throw error;
  }
}

