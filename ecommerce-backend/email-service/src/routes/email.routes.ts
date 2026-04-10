import { Router } from "express";
import { sendEmailController } from "../controllers/email.controller";

const router = Router();

// ✅ POST /email
router.post("/", sendEmailController);

export default router;
