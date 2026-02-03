import { Router } from "express";
import {
  getAllInvoices,
  getInvoice,
  createInvoiceController,
} from "../controllers/invoice.controller";

const router = Router();

// GET all invoices
router.get("/", getAllInvoices);

// GET invoice by id
router.get("/:id", getInvoice);

// CREATE invoice
router.post("/", createInvoiceController);

export default router;

