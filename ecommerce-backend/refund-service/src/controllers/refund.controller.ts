import { Request, Response } from "express";
import { RefundService } from "../services/refund.service";

const refundService = new RefundService();

/**
 * ⚠️ Manual refund (Admin / fallback API)
 * Normally refunds come from Kafka (payment-service)
 */
export async function createRefund(req: Request, res: Response) {
  try {
    const { orderId, paymentId, amount, reason } = req.body;

    // ✅ Validation
    if (!orderId || !paymentId || !amount || !reason) {
      return res.status(400).json({
        message: "orderId, paymentId, amount, reason are required",
      });
    }

    const refund = await refundService.processRefund({
      orderId,
      paymentId,
      amount: Number(amount),
      reason,
    });

    return res.status(201).json(refund);
  } catch (err) {
    console.error("❌ Refund error:", err);
    return res.status(500).json({
      message: "Refund failed",
    });
  }
}

/**
 * 🔎 Get refunds by orderId
 */
export async function getRefundByOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "orderId is required",
      });
    }

    const refunds = await refundService.getRefundByOrder(orderId);

    return res.status(200).json(refunds);
  } catch (err) {
    console.error("❌ Fetch refund error:", err);
    return res.status(500).json({
      message: "Failed to fetch refunds",
    });
  }
}

/**
 * 🔄 Update refund status (Admin)
 */
export async function updateRefundStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        message: "id and status are required",
      });
    }

    const refund = await refundService.updateStatus(id, status);

    return res.status(200).json(refund);
  } catch (err) {
    console.error("❌ Update refund error:", err);
    return res.status(500).json({
      message: "Failed to update refund",
    });
  }
}
