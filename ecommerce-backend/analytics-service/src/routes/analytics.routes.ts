
import { Router } from "express";

import {
  registerEvent,
  vendorAnalytics,
} from "../controllers/analytics.controller";

const router = Router();

// =====================================================
// RECORD ANALYTICS EVENT
// POST /analytics
// =====================================================

router.post("/", registerEvent);

// =====================================================
// VENDOR ANALYTICS
// GET /analytics/vendor
// =====================================================

router.get("/vendor", vendorAnalytics);

export default router;

