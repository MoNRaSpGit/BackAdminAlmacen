import { Router } from "express";
import {
  getProducts,
  updateProduct,
  getFilteredProducts,
  getProductMatches,   // 👈 importamos
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/filtrados", getFilteredProducts);
router.get("/matches", getProductMatches);   // 👈 nueva ruta
router.put("/:id", updateProduct);

export default router;
