import { Router } from "express";
import {
  addItem,
  getCart,
  updateItem,
  removeItem,
  clearCart,
} from "../controllers/cart.controller";

const router = Router();

router.post("/add", addItem);
router.get("/:userId", getCart);
router.put("/update/:itemId", updateItem);
router.delete("/remove/:itemId", removeItem);
router.delete("/clear/:userId", clearCart);

export default router;

