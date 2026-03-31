import { Router } from "express";
import {
  getAllInvoices,
  getInvoice,
  createInvoiceController,
  downloadInvoiceController,
} from "../controllers/invoice.controller";

// 👉 import your auth middleware
import { authMiddleware } from "../middlewares/auth.middleware"; // adjust path

const router = Router();

// 🔐 protect all routes
router.use(authMiddleware);

router.get("/", getAllInvoices);
router.get("/:id", getInvoice);
router.post("/", createInvoiceController);

// 🔗 signed URL download
router.get("/:id/download", downloadInvoiceController);

export default router;
