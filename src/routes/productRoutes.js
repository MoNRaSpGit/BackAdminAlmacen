import { Router } from "express";
import {
  getProducts,
  updateProduct,
  getFilteredProducts,
  getProductsConBarcode,
  addProduct
} from "../controllers/productController.js";

const router = Router();

// Todos los productos
router.get("/", getProducts);

// Productos filtrados (ejemplo: precio > 500 o = 0)
router.get("/filtrados", getFilteredProducts);

// Productos que sí tienen barcode
router.get("/barcode", getProductsConBarcode);

// Actualizar producto
router.put("/:id", updateProduct);

// Agregar producto nuevo
router.post("/", addProduct);

export default router;
