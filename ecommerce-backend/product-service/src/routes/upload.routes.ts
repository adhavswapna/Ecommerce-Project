import { Router } from "express";

import { uploadImage } from "../controllers/upload.controller";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  uploadImage
);

export default router;
