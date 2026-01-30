import { Router } from "express";
import {
  createInventory,
  getInventoryByProduct,
  updateStock,
} from "../controllers/inventory.controller";

const router = Router();

router.post("/", createInventory);
router.get("/:productId", getInventoryByProduct);
router.patch("/:productId", updateStock);

export default router;
