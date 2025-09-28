import { Router } from "express";
import {
  getProducts,
  updateProduct,
  getFilteredProducts,
  getProductsConBarcode,
  addProduct,
  getNotUpdatedProducts 
} from "../controllers/productController.js";

const router = Router();

// 👉 Queda /api/products
router.get("/", getProducts);

// 👉 Queda /api/products/filtrados
router.get("/filtrados", getFilteredProducts);

// 👉 Queda /api/products/barcode
router.get("/barcode", getProductsConBarcode);

// 👉 Queda /api/products/:id
router.put("/:id", updateProduct);

// 👉 Queda /api/products
router.post("/", addProduct);

router.get("/not-updated", getNotUpdatedProducts);

export default router;
