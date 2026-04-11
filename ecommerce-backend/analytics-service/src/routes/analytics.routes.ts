import { Router } from "express";
import { registerEvent } from "../controllers/analytics.controller";

const router = Router();

// POST /analytics
router.post("/", registerEvent);

export default router;
