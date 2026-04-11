import { Request, Response } from "express";
import { recordAnalyticsEvent } from "../services/analytics.service";

export const registerEvent = async (req: Request, res: Response) => {
  try {
    const result = await recordAnalyticsEvent(req.body);

    res.status(201).json({
      success: true,
      message: "Analytics event recorded",
      data: result,
    });
  } catch (error: any) {
    console.error("❌ Analytics Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to record analytics event",
    });
  }
};
