import { Request, Response } from "express";
import { VendorStatus } from "@prisma/client";

import {
  createVendor,
  listVendors,
  getVendorsByUserId,
  getVendorById,
  updateVendorStatus,
} from "../services/vendor-service";

import {
  publishVendorCreated,
  publishVendorStatusUpdated,
} from "../kafka/vendor.producer";


export class VendorController {

  /* =====================================================
     CREATE VENDOR PROFILE
  ===================================================== */

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

      if (!name || !email || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and userId are required",
        });
      }

      const vendor = await createVendor({
        name,
        email,
        phone,
        address,
        userId,
      });

      if (process.env.ENABLE_KAFKA === "true") {
        await publishVendorCreated({
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
        });
      }

      return res.status(201).json({
        success: true,
        message:
          "Vendor profile created successfully",
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "❌ Create Vendor Error:",
        err
      );

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


  /* =====================================================
     GET ALL VENDORS
  ===================================================== */

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
        "❌ Get Vendors Error:",
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


  /* =====================================================
     GET APPROVED ACTIVE VENDORS BY USER ID
  ===================================================== */

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

      console.log(
        "🔎 Vendor lookup:",
        userId
      );

      const vendors =
        await getVendorsByUserId(userId);

      if (!vendors || vendors.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No approved active vendor found for this user",
        });
      }

      return res.status(200).json({
        success: true,
        count: vendors.length,
        data: vendors,
      });

    } catch (err: any) {
      console.error(
        "❌ Get Vendors By User ID Error:",
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


  /* =====================================================
     GET VENDOR BY VENDOR ID
  ===================================================== */

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
        "❌ Get Vendor By ID Error:",
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


  /* =====================================================
     APPROVE VENDOR
  ===================================================== */

  static approveVendor = async (
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

      console.log(
        "✅ Approving vendor:",
        id
      );

      const vendor =
        await updateVendorStatus(
          id,
          VendorStatus.APPROVED
        );

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
          "Vendor approved successfully",
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "❌ Approve Vendor Error:",
        err
      );

      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to approve vendor",
        error: err.message,
      });
    }
  };


  /* =====================================================
     REJECT VENDOR
  ===================================================== */

  static rejectVendor = async (
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

      console.log(
        "❌ Rejecting vendor:",
        id
      );

      const vendor =
        await updateVendorStatus(
          id,
          VendorStatus.REJECTED
        );

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
          "Vendor rejected successfully",
        data: vendor,
      });

    } catch (err: any) {
      console.error(
        "❌ Reject Vendor Error:",
        err
      );

      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to reject vendor",
        error: err.message,
      });
    }
  };


  /* =====================================================
     UPDATE VENDOR STATUS
  ===================================================== */

  static updateStatus = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Vendor ID is required",
        });
      }

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

      const vendor =
        await updateVendorStatus(
          id,
          status
        );

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
        "❌ Update Vendor Status Error:",
        err
      );

      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update vendor status",
        error: err.message,
      });
    }
  };
}
