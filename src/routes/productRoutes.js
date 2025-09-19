import { Router } from "express";
import {
  getProducts,
  updateProduct,
  getFilteredProducts,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/filtrados", getFilteredProducts); // 👈 nueva ruta
router.put("/:id", updateProduct);

export default router;
