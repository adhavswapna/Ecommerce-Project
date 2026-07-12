import { Router } from "express";
import {
  createInventory,
  getInventoryByProduct,
  updateStock,
  reduceStock,
} from "../controllers/inventory.controller";

const router = Router();


/* =================================
   HEALTH CHECK
   MUST BE BEFORE /:productId
================================= */

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "Inventory service running",
  });
});


// ➤ Create inventory
router.post("/", createInventory);


// ➤ Update stock (admin)
router.patch("/:productId", updateStock);


// ➤ Reduce stock (order flow)
router.post("/reduce", reduceStock);


// ➤ Get inventory
// KEEP LAST because it matches anything
router.get("/:productId", getInventoryByProduct);


export default router;
