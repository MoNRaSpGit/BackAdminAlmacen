import { Router } from "express";
import { getProveedores, asignarProductosAProveedor,getProductosSinProveedor } from "../controllers/proveedoresController.js";

const router = Router();

// 👉 GET /api/proveedores
router.get("/", getProveedores);

// 👉 POST /api/proveedores/asignar
router.post("/asignar", asignarProductosAProveedor);

router.get("/sin-proveedor", getProductosSinProveedor); // 👈 nuevo endpoint

export default router;
