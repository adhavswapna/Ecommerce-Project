import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * 🔥 CREATE USER
 * (used by auth-service or manual testing)
 */
router.post("/", UserController.createUser);

/**
 * 👤 CURRENT USER PROFILE
 */
router.get("/me", authMiddleware, UserController.getMe);

/**
 * 🔍 GET USER BY ID
 */
router.get("/:id", UserController.getById);

/**
 * ✏️ UPDATE USER PROFILE
 */
router.put("/:id", authMiddleware, UserController.updateProfile);

/**
 * 🗑️ DELETE USER
 */
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
