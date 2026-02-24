import { Router } from "express";
import { VendorController } from "../controllers/vendor.controller";

const router = Router();

// Vendor routes
router.post("/create", VendorController.createVendor);
router.put("/status/:id", VendorController.updateStatus);

export default router;

