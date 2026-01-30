import { Router } from "express";
import { checkout, listOrders } from "../controllers/order.controller";

const router = Router();

router.post("/checkout", checkout);
router.get("/:userId", listOrders);

export default router;
