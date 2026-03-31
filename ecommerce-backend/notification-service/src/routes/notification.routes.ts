// src/routes/notification.routes.ts

import { Router } from "express";
import { sendNotification } from "../controllers/notification.controller";

const router = Router();

// ✅ IMPORTANT: sendNotification MUST be defined
router.post("/", sendNotification);

export default router;
