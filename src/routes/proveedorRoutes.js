// src/routes/proveedorRoutes.js
import { Router } from "express";
import { getProveedores } from "../controllers/proveedoresController.js";

const router = Router();

// 👉 Queda en /api/proveedores
router.get("/", getProveedores);

export default router;
