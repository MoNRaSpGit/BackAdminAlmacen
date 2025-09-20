import { Router } from "express";
import {
  getProducts,
  updateProduct,
  getFilteredProducts,
  addProduct,
  getProductsConBarcode ,


} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/filtrados", getFilteredProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.get("/products/barcode", getProductsConBarcode);

export default router;
