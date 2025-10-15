// src/controllers/productController.js
import { ProductoModel } from "../models/Producto.js";

/**
 * Obtener todos los productos
 */
export async function getProducts(req, res) {
  try {
    const data = await ProductoModel.getAll();
    res.json(data);
  } catch (err) {
    console.error("❌ Error consultando productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

/**
 * Actualizar producto
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = await ProductoModel.update(id, req.body);
    res.json(data);
  } catch (err) {
    console.error("❌ Error actualizando producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}

/**
 * Insertar producto
 */
export async function addProduct(req, res) {
  try {
    const nuevo = await ProductoModel.insert(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("❌ Error insertando producto:", err);
    res.status(500).json({ error: "Error al insertar producto" });
  }
}

/**
 * Marcar producto como chequeado
 */
export async function marcarProductoChequeado(req, res) {
  try {
    const ok = await ProductoModel.markChecked(req.params.id);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({
      id: req.params.id,
      last_checked_at: new Date().toISOString(),
      message: "Producto marcado como chequeado ✅"
    });
  } catch (err) {
    console.error("❌ Error al marcar producto chequeado:", err);
    res.status(500).json({ error: "Error al marcar producto chequeado" });
  }
}

/**
 * Otros controladores: getFiltered, getNotUpdated, getProductsConBarcode, etc.
 */
export async function getFilteredProducts(req, res) {
  try {
    const data = await ProductoModel.getFiltered();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos filtrados" });
  }
}

export async function getNotUpdatedProducts(req, res) {
  try {
    const data = await ProductoModel.getNotUpdated();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos no actualizados" });
  }
}

export async function getProductsConBarcode(req, res) {
  try {
    const data = await ProductoModel.getWithBarcode();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos con código" });
  }
}

export async function getProductByBarcode(req, res) {
  try {
    const prod = await ProductoModel.getByBarcode(req.params.barcode);
    if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener producto por código" });
  }
}
