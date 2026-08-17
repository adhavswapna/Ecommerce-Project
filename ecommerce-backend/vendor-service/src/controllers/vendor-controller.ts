import { Request, Response } from "express";
import { VendorStatus } from "@prisma/client";

import {
  createVendor,
  listVendors,
  getVendorByUserId,
  getVendorById,
  updateVendorStatus,
} from "../services/vendor-service";

import {
  publishVendorCreated,
  publishVendorStatusUpdated,
} from "../kafka/vendor.producer";

export class VendorController {

  // =====================================================
  // CREATE VENDOR PROFILE
  // =====================================================

  static createVendor = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        userId,
      } = req.body;

      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

      if (!name || !email || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and userId are required",
        });
      }

      // -------------------------------------------------
      // CREATE VENDOR
      // -------------------------------------------------

      const vendor = await createVendor({
        name,
        email,
        phone,
        address,
        userId,
      });

      // -------------------------------------------------
      // KAFKA EVENT
      // -------------------------------------------------

      if (process.env.ENABLE_KAFKA === "true") {
        await publishVendorCreated({
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
        });
      }

      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      return res.status(201).json({
        success: true,
        message:
          "Vendor profile created successfully",
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "Create Vendor Error:",
        err
      );

      // Prisma duplicate error
      if (err.code === "P2002") {
        return res.status(400).json({
          success: false,
          message:
            "Vendor email or userId already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create vendor",
        error: err.message,
      });
    }
  };

  // =====================================================
  // GET ALL VENDORS
  // =====================================================

  static getVendors = async (
    _req: Request,
    res: Response
  ) => {
    try {
      const vendors = await listVendors();

      return res.status(200).json({
        success: true,
        count: vendors.length,
        data: vendors,
      });

    } catch (err: any) {
      console.error(
        "Get Vendors Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch vendors",
        error: err.message,
      });
    }
  };

  // =====================================================
  // GET VENDOR BY USER ID
  // =====================================================
  //
  // GET /vendors/user/:userId
  //
  // Example:
  //
  // User ID
  // 8a734868-281d-430d-9352-953d01538dfc
  //
  // ↓
  //
  // Vendor.userId
  //
  // =====================================================

  static getVendorByUserId = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const vendor =
        await getVendorByUserId(userId);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "Get Vendor By User ID Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch vendor",
        error: err.message,
      });
    }
  };

  // =====================================================
  // GET VENDOR BY VENDOR ID
  // =====================================================
  //
  // GET /vendors/:id
  //
  // This is the endpoint used for:
  //
  // Product.vendorId
  //        ↓
  // Vendor.id
  //
  // =====================================================

  static getVendorById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Vendor ID is required",
        });
      }

      const vendor =
        await getVendorById(id);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "Get Vendor By ID Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch vendor",
        error: err.message,
      });
    }
  };

  // =====================================================
  // UPDATE VENDOR STATUS
  // =====================================================

  static updateStatus = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // -------------------------------------------------
      // VALIDATE STATUS
      // -------------------------------------------------

      if (
        !Object.values(VendorStatus).includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status value",
        });
      }

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      const vendor =
        await updateVendorStatus(
          id,
          status
        );

      // -------------------------------------------------
      // KAFKA EVENT
      // -------------------------------------------------

      if (process.env.ENABLE_KAFKA === "true") {
        await publishVendorStatusUpdated({
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          status: vendor.status,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Vendor status updated",
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "Update Vendor Status Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update vendor status",
        error: err.message,
      });
    }
  };
}
