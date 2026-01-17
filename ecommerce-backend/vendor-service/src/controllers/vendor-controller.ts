import { Request, Response } from "express";
import { createVendor, listVendors, updateVendorStatus } from "../services/vendor-service";

export async function addVendor(req: Request, res: Response) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const vendor = await createVendor(name, email);
    return res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getVendors(req: Request, res: Response) {
  try {
    const vendors = await listVendors();
    return res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleVendorStatus(req: Request, res: Response) {
  try {
    const vendorId = String(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be boolean" });
    }

    const vendor = await updateVendorStatus(vendorId, isActive);
    return res.status(200).json(vendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
