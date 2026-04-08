import { Router } from "express";
import { shipOrder } from "../controllers/shipping.controller";

const router = Router();

router.post("/", shipOrder);

export default router;
