import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * 🔥 CREATE USER
 * POST /users
 *
 * Used by auth-service or manual testing.
 */
router.post("/", UserController.createUser);

/**
 * 👥 GET ALL USERS
 * GET /users
 *
 * Used by admin-dashboard.
 */
router.get("/", authMiddleware, UserController.getAllUsers);

/**
 * 👤 CURRENT USER PROFILE
 * GET /users/me
 */
router.get("/me", authMiddleware, UserController.getMe);

/**
 * 🔍 GET USER BY ID
 * GET /users/:id
 */
router.get("/:id", UserController.getById);

/**
 * ✏️ UPDATE USER PROFILE
 * PUT /users/:id
 */
router.put("/:id", authMiddleware, UserController.updateProfile);

/**
 * 🗑️ DELETE USER
 * DELETE /users/:id
 */
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
