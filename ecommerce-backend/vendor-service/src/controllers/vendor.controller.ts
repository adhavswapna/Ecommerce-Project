import { Request, Response } from "express";
import { VendorStatus } from "@prisma/client";

import {
  createVendor,
  listVendors,
  updateVendorStatus,
} from "../services/vendor.service";

import {
  publishVendorCreated,
  publishVendorStatusUpdated,
} from "../kafka/vendor.producer";

export class VendorController {
  // ----------------------
  // Create Vendor
  // ----------------------
  static createVendor = async (req: Request, res: Response) => {
    try {
      const { name, email, phone, address, userId } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          message: "Name and Email are required",
        });
      }

      const vendor = await createVendor({
        name,
        email,
        phone,
        address,
        userId,
      });

      // Kafka Event
      await publishVendorCreated({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
      });

      res.status(201).json({
        success: true,
        data: vendor,
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      res.status(500).json({
        message: "Failed to create vendor",
        error: err.message,
      });
    }
  };

  // ----------------------
  // Get All Vendors
  // ----------------------
  static getVendors = async (_req: Request, res: Response) => {
    try {
      const vendors = await listVendors();

      res.json({
        success: true,
        count: vendors.length,
        data: vendors,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "Failed to fetch vendors",
        error: err.message,
      });
    }
  };

  // ----------------------
  // Update Vendor Status
  // ----------------------
  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate enum
      if (!Object.values(VendorStatus).includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      const vendor = await updateVendorStatus(id, status);

      // Kafka Event
      await publishVendorStatusUpdated({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status,
      });

      res.json({
        success: true,
        message: "Vendor status updated",
        data: vendor,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "Failed to update vendor status",
        error: err.message,
      });
    }
  };
}
