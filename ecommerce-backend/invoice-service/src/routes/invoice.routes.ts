import { Router } from "express";

import {
  getAllInvoices,
  getInvoice,
  createInvoiceController,
  downloadInvoiceController,
} from "../controllers/invoice.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();


/**
 * ============================
 * Health check
 * MUST be before /:id
 * ============================
 */
router.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "UP",
    service: "Invoice Service",
  });
});


/**
 * ============================
 * Protected routes
 * ============================
 */
router.use(authMiddleware);


/**
 * Get all invoices
 * GET /invoices
 */
router.get("/", getAllInvoices);


/**
 * Create invoice
 * POST /invoices
 */
router.post("/", createInvoiceController);


/**
 * Download invoice
 * GET /invoices/:id/download
 *
 * MUST BE BEFORE /:id
 */
router.get("/:id/download", downloadInvoiceController);


/**
 * Get invoice by id
 * GET /invoices/:id
 *
 * ALWAYS LAST
 */
router.get("/:id", getInvoice);


export default router;
