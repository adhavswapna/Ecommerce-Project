
import { Router } from "express";

import {
  registerEvent,
  vendorAnalytics,
  adminAnalytics,
} from "../controllers/analytics.controller";

const router = Router();

// =====================================================
// RECORD ANALYTICS EVENT
// POST /analytics
// =====================================================

router.post("/", registerEvent);

// =====================================================
// ADMIN / PLATFORM ANALYTICS
// GET /analytics/admin
// =====================================================

router.get("/admin", adminAnalytics);

// =====================================================
// VENDOR ANALYTICS
// GET /analytics/vendor
// =====================================================

router.get("/vendor", vendorAnalytics);

export default router;

