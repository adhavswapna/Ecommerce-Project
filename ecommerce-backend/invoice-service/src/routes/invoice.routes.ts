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
 * 🔐 All routes protected
 */
router.use(authMiddleware);

/**
 * 📄 Invoice Routes
 */
router.get("/", getAllInvoices);
router.get("/:id", getInvoice);
router.post("/", createInvoiceController); // manual trigger
router.get("/:id/download", downloadInvoiceController);

export default router;
