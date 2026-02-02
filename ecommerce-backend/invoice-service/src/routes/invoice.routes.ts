import { Router } from "express";
import {
  createInvoice,
  getInvoice,
  listInvoices,
} from "../controllers/invoice.controller";

const router = Router();

router.post("/", createInvoice);
router.get("/", listInvoices);
router.get("/:id", getInvoice);

export default router;
