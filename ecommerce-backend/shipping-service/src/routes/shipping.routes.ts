import { Router } from "express";
import { shipOrder } from "../controllers/shipping.controller";

const router = Router();

router.post("/ship", shipOrder);

export default router;
