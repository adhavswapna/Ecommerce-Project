import { Router } from "express";
import { registerEvent } from "../controllers/analytics.controller";

const router = Router();

// POST /analytics/event
router.post("/event", registerEvent);

export default router;

