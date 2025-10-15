import { Router } from "express";
import {
  getProveedores,
  asignarProductosAProveedor,
  getProductosSinProveedor,
  getProductosPorProveedor  // 👈 agregalo acá
} from "../controllers/proveedoresController.js";

const router = Router();

// 👉 GET /api/proveedores
router.get("/", getProveedores);

// 👉 POST /api/proveedores/asignar
router.post("/asignar", asignarProductosAProveedor);

// 👉 GET /api/proveedores/sin-proveedor
router.get("/sin-proveedor", getProductosSinProveedor);

// 🆕 GET /api/proveedores/:proveedorId/productos
router.get("/:proveedorId/productos", getProductosPorProveedor);

export default router;
