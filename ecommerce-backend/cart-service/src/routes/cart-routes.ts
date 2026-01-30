import { Router } from "express";
import { addItem, getCart } from "../controllers/cart-controller";

const router = Router();

// Add item to cart
router.post("/add", addItem);

// Get cart by userId
router.get("/:userId", getCart);

export default router;

