// src/controllers/proveedorController.js
import { ProveedorModel } from "../models/Proveedor.js";

/**
 * 📋 Obtener todos los proveedores
 */
export async function getProveedores(req, res) {
  try {
    const data = await ProveedorModel.getAll();
    res.json(data);
  } catch (err) {
    console.error("❌ Error consultando proveedores:", err);
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
}

/**
 * 🔗 Asignar productos a un proveedor
 */
export async function asignarProductosAProveedor(req, res) {
  try {
    const { proveedorId, productos } = req.body;
    await ProveedorModel.assignProducts(proveedorId, productos);
    res.json({ message: "Productos asignados correctamente ✅" });
  } catch (err) {
    console.error("❌ Error asignando productos:", err);
    res.status(500).json({ error: "Error al asignar productos" });
  }
}

/**
 * 🚫 Obtener productos sin proveedor
 */
export async function getProductosSinProveedor(req, res) {
  try {
    const data = await ProveedorModel.getProductosSinProveedor();
    res.json(data);
  } catch (err) {
    console.error("❌ Error consultando productos sin proveedor:", err);
    res.status(500).json({ error: "Error al obtener productos sin proveedor" });
  }
}

/**
 * 📦 Obtener productos por proveedor
 */
export async function getProductosPorProveedor(req, res) {
  try {
    const { proveedorId } = req.params;
    const data = await ProveedorModel.getProductosPorProveedor(proveedorId);
    res.json(data);
  } catch (err) {
    console.error("❌ Error consultando productos por proveedor:", err);
    res.status(500).json({ error: "Error al obtener productos por proveedor" });
  }
}
