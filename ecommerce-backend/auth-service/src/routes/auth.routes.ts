import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../constants/role.enum";

const router = Router();

/* =========================
   PUBLIC ROUTES
========================= */

// 🔐 Local Login / Register
router.post("/login", AuthController.login);
router.post("/register", AuthController.registerUser);

// 🔐 Password Recovery
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// 🔥 GOOGLE OAUTH LOGIN
router.get("/google", AuthController.googleLogin);
router.get("/google/callback", AuthController.googleCallback);


/* =========================
   AUTHENTICATED USER ROUTES
========================= */

router.get("/me", authMiddleware, AuthController.me);


/* =========================
   ADMIN ONLY ROUTES
========================= */

// Register Vendor (Admin Only)
router.post(
  "/register/vendor",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerVendor
);

// Register Admin (Admin Only)
router.post(
  "/register/admin",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerAdmin
);

export default router;
