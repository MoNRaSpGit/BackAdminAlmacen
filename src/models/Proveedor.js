// src/models/Proveedor.js
import { pool } from "../config/db.js";

export const ProveedorModel = {
  /**
   * 📋 Obtener todos los proveedores
   */
  async getAll() {
    const [rows] = await pool.query(`
      SELECT id, nombre, contacto 
      FROM proveedores 
      ORDER BY nombre ASC
    `);
    return rows;
  },

  /**
   * 🔗 Asignar productos a un proveedor
   */
  async assignProducts(proveedorId, productos) {
    if (!proveedorId || !Array.isArray(productos)) {
      throw new Error("Datos inválidos");
    }

    for (const productoId of productos) {
      await pool.query(
        `INSERT INTO productos_test_proveedores (proveedor_id, producto_id, costo)
         VALUES (?, ?, 0)
         ON DUPLICATE KEY UPDATE proveedor_id = VALUES(proveedor_id)`,
        [proveedorId, productoId]
      );
    }
  },

  /**
   * 🚫 Obtener productos sin proveedor
   */
  async getProductosSinProveedor() {
    const [rows] = await pool.query(`
      SELECT 
        p.id, p.name, p.price, p.barcode, p.description, p.image
      FROM productos_test p
      LEFT JOIN productos_test_proveedores r ON r.producto_id = p.id
      WHERE r.producto_id IS NULL
      ORDER BY p.name ASC
    `);
    return rows;
  },

  /**
   * 📦 Obtener productos de un proveedor específico
   */
  async getProductosPorProveedor(proveedorId) {
    const [rows] = await pool.query(`
      SELECT 
        p.id, p.name, p.price, p.barcode, p.description
      FROM productos_test p
      INNER JOIN productos_test_proveedores r ON r.producto_id = p.id
      WHERE r.proveedor_id = ?
      ORDER BY p.name ASC
    `, [proveedorId]);
    return rows;
  }
};
