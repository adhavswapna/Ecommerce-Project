import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  getStock,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/check-stock/:id", getStock);
router.post("/", addProduct);
router.put("/:id", editProduct);
router.delete("/:id", removeProduct);

export default router;

