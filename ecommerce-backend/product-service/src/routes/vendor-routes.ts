import { Router } from "express";
import { VendorController } from "../controllers/vendor.controller";

const router = Router();

// =====================================================
// CREATE VENDOR PROFILE
// =====================================================

router.post(
  "/create",
  VendorController.createVendor
);

// =====================================================
// GET ALL VENDORS
// =====================================================

router.get(
  "/",
  VendorController.getVendors
);

// =====================================================
// GET VENDOR BY USER ID
// MUST BE BEFORE /status/:id
// =====================================================

router.get(
  "/user/:userId",
  VendorController.getVendorByUserId
);

// =====================================================
// UPDATE VENDOR STATUS
// =====================================================

router.put(
  "/status/:id",
  VendorController.updateStatus
);

export default router;
