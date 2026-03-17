import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, UserController.getMe);

router.get("/:id", UserController.getById);

router.put("/:id", authMiddleware, UserController.updateProfile);

router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
