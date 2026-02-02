import { Router } from "express";
import { createAdmin, adminHealth, banUser } from "../controllers/admin.controller";

const router = Router();

// POST /admin → create admin
router.post("/", createAdmin);

// GET /admin/health → health check
router.get("/health", adminHealth);

// POST /admin/user/ban → ban user
router.post("/user/ban", banUser);

export default router;

