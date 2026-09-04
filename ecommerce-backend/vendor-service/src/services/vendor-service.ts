import prisma from "../db/prisma/prisma";
import { VendorStatus } from "@prisma/client";

/* =========================================================
   CREATE VENDOR
========================================================= */

/*
 * Vendor profile is created AFTER AuthUser.
 *
 * New workflow:
 *
 * Vendor
 *   ↓
 * Auth Service creates AuthUser
 *   ↓
 * auth.user.created
 *   ↓
 * Vendor Service receives event
 *   ↓
 * Vendor profile created
 *   ↓
 * status = PENDING
 * isActive = false
 *   ↓
 * Admin approves
 *   ↓
 * vendor.status.updated
 *   ↓
 * Auth Service updates AuthUser.vendorStatus
 *
 * Auth Service owns:
 *   - AuthUser
 *   - password
 *   - login
 *   - authentication
 *
 * Vendor Service owns:
 *   - Vendor
 *   - vendor profile
 *   - approval status
 *   - active/inactive state
 */

export async function createVendor(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId: string;
}) {
  try {
    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!data.name || data.name.trim() === "") {
      throw new Error(
        "Vendor name is required"
      );
    }

    if (!data.email || data.email.trim() === "") {
      throw new Error(
        "Vendor email is required"
      );
    }

    if (!data.userId || data.userId.trim() === "") {
      throw new Error(
        "Vendor userId is required"
      );
    }

    const email =
      data.email.trim().toLowerCase();

    const name =
      data.name.trim();

    /* =====================================================
       CHECK FOR EXISTING VENDOR

       This protects against duplicate vendor profiles
       if the Kafka event is delivered more than once.
    ===================================================== */

    const existingVendor =
      await prisma.vendor.findFirst({
        where: {
          OR: [
            {
              userId: data.userId,
            },
            {
              email,
            },
          ],
        },
      });

    if (existingVendor) {
      console.log(
        "ℹ️ Vendor already exists:",
        {
          id: existingVendor.id,
          userId: existingVendor.userId,
          email: existingVendor.email,
          status: existingVendor.status,
        }
      );

      return existingVendor;
    }

    /* =====================================================
       CREATE VENDOR

       Every newly registered vendor starts as:

         status   = PENDING
         isActive = false

       Admin approval is required before activation.
    ===================================================== */

    const vendor =
      await prisma.vendor.create({
        data: {
          userId: data.userId,

          name,

          email,

          phone:
            data.phone?.trim() || null,

          address:
            data.address?.trim() || null,

          status:
            VendorStatus.PENDING,

          isActive: false,
        },
      });

    console.log(
      "=========================================="
    );

    console.log(
      "✅ Vendor profile created"
    );

    console.log({
      id: vendor.id,
      userId: vendor.userId,
      name: vendor.name,
      email: vendor.email,
      status: vendor.status,
      isActive: vendor.isActive,
    });

    console.log(
      "=========================================="
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
   GET APPROVED + ACTIVE VENDORS BY USER ID
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

          status:
            VendorStatus.APPROVED,

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

          status:
            VendorStatus.APPROVED,

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

/*
 * APPROVED:
 *   status   = APPROVED
 *   isActive = true
 *
 * REJECTED:
 *   status   = REJECTED
 *   isActive = false
 *
 * PENDING:
 *   status   = PENDING
 *   isActive = false
 *
 * Vendor becomes active ONLY after admin approval.
 */

export async function updateVendorStatus(
  id: string,
  status: VendorStatus
) {
  try {
    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!id || id.trim() === "") {
      throw new Error(
        "Vendor ID is required"
      );
    }

    if (
      !Object.values(VendorStatus).includes(
        status
      )
    ) {
      throw new Error(
        "Invalid vendor status"
      );
    }

    /* =====================================================
       DETERMINE ACTIVE STATE
    ===================================================== */

    const isActive =
      status === VendorStatus.APPROVED;

    /* =====================================================
       UPDATE VENDOR
    ===================================================== */

    const vendor =
      await prisma.vendor.update({
        where: {
          id,
        },

        data: {
          status,
          isActive,
        },
      });

    console.log(
      "=========================================="
    );

    console.log(
      "✅ Vendor status updated"
    );

    console.log({
      id: vendor.id,
      userId: vendor.userId,
      email: vendor.email,
      status: vendor.status,
      isActive: vendor.isActive,
    });

    console.log(
      "=========================================="
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
