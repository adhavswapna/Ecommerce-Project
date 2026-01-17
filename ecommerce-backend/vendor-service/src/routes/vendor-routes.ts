import { Router } from "express";
import { addVendor, getVendors, toggleVendorStatus } from "../controllers/vendor-controller";

const router = Router();

router.post("/", addVendor);
router.get("/", getVendors);
router.patch("/:id/status", toggleVendorStatus);

export default router;
