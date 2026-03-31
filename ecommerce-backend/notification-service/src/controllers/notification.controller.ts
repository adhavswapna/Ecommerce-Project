// src/controllers/notification.controller.ts

import { Request, Response } from "express";
import { handleNotification } from "../services/notification.service";

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const result = await handleNotification(req.body);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Notification error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
