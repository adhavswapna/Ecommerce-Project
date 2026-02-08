import { Request, Response } from "express";
import prisma from "../db/prisma/prisma";
import {
  publishVendorCreated,
  publishVendorStatusUpdated,
} from "../kafka/vendor.producer";

// Vendor Controller
export class VendorController {
  // ----------------------
  // Create Vendor
  // ----------------------
  static createVendor = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
      const vendor = await prisma.vendor.create({
        data: { name, email },
      });

      // Kafka event
      await publishVendorCreated({ id: vendor.id, name: vendor.name, email: vendor.email });

      res.status(201).json(vendor);
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: err.message });
    }
  };

  // ----------------------
  // Update Vendor Status
  // ----------------------
  static updateStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const vendor = await prisma.vendor.update({
        where: { id },
        data: { status },
      });

      await publishVendorStatusUpdated({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status,
      });

      res.json({ message: "Vendor status updated" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}

