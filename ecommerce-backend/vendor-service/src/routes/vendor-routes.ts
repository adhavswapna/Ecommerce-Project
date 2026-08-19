import { Router } from "express";
import { VendorController } from "../controllers/vendor-controller";

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
//
// GET /api/vendors
//
// =====================================================

router.get(
  "/",
  VendorController.getVendors
);


// =====================================================
// GET VENDOR BY USER ID
// =====================================================
//
// GET /api/vendors/user/:userId
//
// IMPORTANT:
// This route must come before /:id.
//

router.get(
  "/user/:userId",
  VendorController.getVendorByUserId
);


// =====================================================
// APPROVE VENDOR
// =====================================================
//
// POST /api/vendors/:id/approve
//
// =====================================================

router.post(
  "/:id/approve",
  VendorController.approveVendor
);


// =====================================================
// REJECT VENDOR
// =====================================================
//
// POST /api/vendors/:id/reject
//
// =====================================================

router.post(
  "/:id/reject",
  VendorController.rejectVendor
);


// =====================================================
// UPDATE VENDOR STATUS
// =====================================================
//
// PUT /api/vendors/status/:id
//
// =====================================================

router.put(
  "/status/:id",
  VendorController.updateStatus
);


// =====================================================
// GET VENDOR BY VENDOR ID
// =====================================================
//
// GET /api/vendors/:id
//
// IMPORTANT:
// Keep this AFTER /approve and /reject.
//

router.get(
  "/:id",
  VendorController.getVendorById
);


export default router;
