import { Router } from "express";
import {
  createInventory,
  getInventoryByProduct,
  updateStock,
  reduceStock,
} from "../controllers/inventory.controller";

const router = Router();

// ➤ Create inventory
router.post("/", createInventory);

// ➤ Get inventory
router.get("/:productId", getInventoryByProduct);

// ➤ Update stock (admin)
router.patch("/:productId", updateStock);

// ➤ Reduce stock (order flow)
router.post("/reduce", reduceStock);

export default router;
