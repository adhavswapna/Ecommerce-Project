import { Request, Response } from "express";
import { createShipment } from "../services/shipping.service";

export const shipOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, userId, address, trackingId } = req.body;

    if (!orderId || !userId || !address || !trackingId) {
      return res.status(400).json({
        success: false,
        message: "orderId, userId, address, trackingId are required",
      });
    }

    const shipment = await createShipment({
      orderId,
      userId,
      address: JSON.stringify(address),
      trackingId,
    });

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (error: any) {
    console.error("❌ Shipment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.message,
    });
  }
};
