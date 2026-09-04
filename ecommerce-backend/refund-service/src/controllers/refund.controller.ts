import { Request, Response } from "express";
import { RefundService } from "../services/refund.service";

const refundService = new RefundService();

const VALID_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "PICKED_UP",
  "COMPLETED",
];

/**
 * Helper: safely extract params (fixes string | string[])
 */
function getParam(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

/**
 * CREATE REFUND
 * POST /refunds
 */
export async function createRefund(req: Request, res: Response) {
  try {
    const { orderId, paymentId, amount, reason } = req.body;

    if (!orderId || !paymentId || !amount || !reason) {
      return res.status(400).json({
        message: "orderId, paymentId, amount, reason are required",
      });
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be a valid positive number",
      });
    }

    // ✅ FIXED: JWT contains userId, not id
    const user = (req as any).user;

    console.log("🔥 AUTH USER:", user); // debug (optional)

    const userId = user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const refund = await refundService.processRefund({
      orderId,
      paymentId,
      userId,
      amount: Number(amount),
      reason,
    });

    return res.status(201).json({
      message: "Refund created successfully",
      data: refund,
    });
  } catch (err: any) {
    console.error("createRefund error:", err);

    return res.status(500).json({
      message: "Refund failed",
      error: err?.message || "Internal Server Error",
    });
  }
}

/**
 * GET REFUNDS BY ORDER
 * GET /refunds/order/:orderId
 */
export async function getRefundByOrder(req: Request, res: Response) {
  try {
    const orderId = getParam(req.params.orderId);

    if (!orderId) {
      return res.status(400).json({
        message: "orderId is required",
      });
    }

    const refunds = await refundService.getRefundByOrder(orderId);

    return res.status(200).json({
      message: "Refunds fetched successfully",
      count: refunds.length,
      data: refunds,
    });
  } catch (err: any) {
    console.error("getRefundByOrder error:", err);

    return res.status(500).json({
      message: "Failed to fetch refunds",
      error: err?.message || "Internal Server Error",
    });
  }
}

/**
 * UPDATE REFUND STATUS
 * PATCH /refunds/:id
 */
export async function updateRefundStatus(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        message: "id and status are required",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const refund = await refundService.updateStatus(id, status);

    return res.status(200).json({
      message: "Refund status updated successfully",
      data: refund,
    });
  } catch (err: any) {
    console.error("updateRefundStatus error:", err);

    return res.status(500).json({
      message: "Failed to update refund",
      error: err?.message || "Internal Server Error",
    });
  }
}
/**
 * GET ALL REFUNDS
 * GET /refunds
 */
export async function getAllRefunds(
  req: Request,
  res: Response
) {
  try {
    const refunds = await refundService.getAllRefunds();

    return res.status(200).json({
      message: "Refunds fetched successfully",
      count: refunds.length,
      data: refunds,
    });
  } catch (err: any) {
    console.error("getAllRefunds error:", err);

    return res.status(500).json({
      message: "Failed to fetch refunds",
      error: err?.message || "Internal Server Error",
    });
  }
}
