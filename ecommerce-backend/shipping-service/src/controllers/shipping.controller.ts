import { Request, Response } from "express";
import { createShipment } from "../services/shipping.service";

export const shipOrder = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  const shipment = await createShipment(orderId);

  res.status(201).json({
    success: true,
    data: shipment
  });
};

