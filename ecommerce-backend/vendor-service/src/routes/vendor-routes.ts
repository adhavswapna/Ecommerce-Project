import { Router } from "express";
import { VendorController } from "../controllers/vendor.controller";

const router = Router();


// Create vendor
router.post(
  "/create",
  VendorController.createVendor
);


// Get all vendors
router.get(
  "/",
  VendorController.getVendors
);


// Update status
router.put(
  "/status/:id",
  VendorController.updateStatus
);


export default router;
