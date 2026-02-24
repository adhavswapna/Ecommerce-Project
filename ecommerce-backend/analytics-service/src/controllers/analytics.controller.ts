import { Request, Response } from "express";
import { recordAnalyticsEvent } from "../services/analytics.service";

export const registerEvent = async (req: Request, res: Response) => {
  try {
    const result = await recordAnalyticsEvent(req.body);

    res.status(201).json({
      message: "Analytics event recorded",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to record analytics event",
    });
  }
};

