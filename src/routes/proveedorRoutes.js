import { Router } from "express";
import { getProveedores, asignarProductosAProveedor,getProductosSinProveedor } from "../controllers/proveedoresController.js";

const router = Router();

// 👉 GET /api/proveedores
router.get("/", getProveedores);

// 👉 POST /api/proveedores/asignar
router.post("/asignar", asignarProductosAProveedor);

router.get("/sin-proveedor", getProductosSinProveedor); // 👈 nuevo endpoint

router.get("/:proveedorId/productos", getProductosPorProveedor);

export default router;
