import { Router } from "express";
import {
  getProducts,
  updateProduct,
  getFilteredProducts,
  getProductsConBarcode
} from "../controllers/productController.js";

const router = Router();

router.get("/products", getProducts);
router.get("/products/filtrados", getFilteredProducts);
router.get("/products/barcode", getProductsConBarcode);
router.put("/products/:id", updateProduct);

export default router;
