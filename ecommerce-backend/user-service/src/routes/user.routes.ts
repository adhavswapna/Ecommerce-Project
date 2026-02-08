import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// User registration
router.post("/register", UserController.register);

// User verification
router.post("/verify/:id", UserController.verify);

// User login
router.post("/login", UserController.login);

// Update profile
router.put("/update/:id", UserController.updateProfile);

// Password reset
router.post("/password/reset/request", UserController.passwordResetRequest);
router.post("/password/reset/complete", UserController.passwordResetComplete);

// Delete user
router.delete("/delete/:id", UserController.deleteUser);

export default router;

