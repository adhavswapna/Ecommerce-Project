import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../constants/role.enum";

const router = Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Login
router.post(
  "/login",
  AuthController.login
);

// Normal customer registration
router.post(
  "/register",
  AuthController.registerUser
);

// Password recovery
router.post(
  "/forgot-password",
  AuthController.forgotPassword
);

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

// =====================================================
// AUTHENTICATED USER
// =====================================================

router.get(
  "/me",
  authMiddleware,
  AuthController.me
);

// =====================================================
// ADMIN ONLY
// =====================================================

// Create Vendor Authentication Account
//
// Admin provides:
// name
// email
// password
// phone
// address
//
// Auth Service creates AuthUser with:
// role = VENDOR
//
// Then returns:
// userId
// token
// user

router.post(
  "/register/vendor",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerVendor
);

// =====================================================
// ADMIN ONLY
// =====================================================

// Create another Admin
router.post(
  "/register/admin",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerAdmin
);

export default router;
