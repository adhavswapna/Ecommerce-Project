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

// Vendor self-registration
//
// Vendor provides:
// - name
// - email
// - password
// - phone
// - address
//
// Vendor account is created with PENDING status.
// No login token is returned until admin approves
// the vendor application.
router.post(
  "/register/vendor",
  AuthController.registerVendor
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

// Create another admin
router.post(
  "/register/admin",
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerAdmin
);

export default router;
