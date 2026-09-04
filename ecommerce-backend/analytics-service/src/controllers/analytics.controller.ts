
import { Request, Response } from "express";

import {
  recordAnalyticsEvent,
  getVendorAnalytics,
  getAdminAnalytics,
} from "../services/analytics.service";

// =====================================================
// RECORD ANALYTICS EVENT
// =====================================================

export const registerEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await recordAnalyticsEvent(req.body);

    return res.status(201).json({
      success: true,
      message: "Analytics event recorded",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "❌ Analytics Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to record analytics event",
    });
  }
};

// =====================================================
// GET VENDOR ANALYTICS
// =====================================================

export const vendorAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const vendorId =
      typeof req.query.vendorId === "string"
        ? req.query.vendorId
        : undefined;

    const analytics =
      await getVendorAnalytics(vendorId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error(
      "❌ Vendor Analytics Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch vendor analytics",
    });
  }
};

// =====================================================
// GET ADMIN / PLATFORM ANALYTICS
// =====================================================

export const adminAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const analytics =
      await getAdminAnalytics();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error(
      "❌ Admin Analytics Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch admin analytics",
    });
  }
};
