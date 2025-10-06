import { Router } from "express";
import { getProveedores, asignarProductosAProveedor } from "../controllers/proveedoresController.js";

const router = Router();

// 👉 GET /api/proveedores
router.get("/", getProveedores);

// 👉 POST /api/proveedores/asignar
router.post("/asignar", asignarProductosAProveedor);

export default router;
