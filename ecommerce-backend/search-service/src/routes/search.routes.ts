import { Router } from "express";
import { search } from "../controllers/search.controller";

const router = Router();

// ✅ Search products (POST with filters)
router.post("/", search);

export default router;
