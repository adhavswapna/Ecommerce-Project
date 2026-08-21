import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../constants/role.enum";

const router = Router();

/* =====================================================
   PUBLIC AUTH ROUTES
===================================================== */

// Login
router.post(
  "/login",
  AuthController.login
);

// Customer registration
router.post(
  "/register",
  AuthController.registerUser
);

// Forgot password
router.post(
  "/forgot-password",
  AuthController.forgotPassword
);

// Reset password
router.post(
  "/reset-password",
  AuthController.resetPassword
);

// Google OAuth
router.get(
  "/google",
  AuthController.googleLogin
);

router.get(
  "/google/callback",
  AuthController.googleCallback
);


/* =====================================================
   AUTHENTICATED USER
===================================================== */

// Current logged-in user
router.get(
  "/me",
  authMiddleware,
  AuthController.me
);


/* =====================================================
   ADMIN ONLY
===================================================== */

// Create vendor authentication account
router.post(
  "/register/vendor",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerVendor
);

// Create another admin
router.post(
  "/register/admin",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerAdmin
);

export default router;
