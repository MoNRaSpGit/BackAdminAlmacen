// src/models/Producto.js
import mysql from "mysql2/promise";
import { pool } from "../config/db.js";
import { DB } from "../config/env.js";

export const ProductoModel = {
  /**
   * 📦 Obtener todos los productos (con proveedor)
   */
  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        p.id, p.name, p.priceOriginal, p.price, p.barcode, p.description,
        p.status, p.updated_at, p.last_checked_at,
        r.proveedor_id, pr.nombre AS proveedor_nombre
      FROM productos_test p
      LEFT JOIN productos_test_proveedores r ON r.producto_id = p.id
      LEFT JOIN proveedores pr ON pr.id = r.proveedor_id
      ORDER BY p.name ASC
    `);
    return rows;
  },

  /**
   * 🔍 Buscar producto por código de barras
   */
  async getByBarcode(barcode) {
    const [rows] = await pool.query(
      `SELECT id, name, priceOriginal, price, barcode, image, description 
       FROM productos_test 
       WHERE barcode = ?`,
      [barcode]
    );
    return rows[0];
  },

  /**
   * 💾 Insertar nuevo producto
   */
  async insert({ name, price, priceOriginal, barcode, description }) {
    const [result] = await pool.query(
      `INSERT INTO productos_test 
        (name, priceOriginal, price, barcode, description, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, priceOriginal || 0, price || 0, barcode || null, description || null]
    );

    return {
      id: result.insertId,
      name,
      priceOriginal,
      price,
      barcode,
      description,
    };
  },

  /**
   * ✏️ Actualizar producto (nombre, precios, código)
   */
  /**
 * ✏️ Actualizar producto (nombre, precios, código y proveedor)
 */
async update(id, { name, price, priceOriginal, barcode, proveedor_id }) {
  const conn = await mysql.createConnection(DB);
  try {
    await conn.query("SET innodb_lock_wait_timeout = 5");

    // 🔹 Actualizar producto principal
    await conn.query(
      `UPDATE productos_test 
       SET name = ?, price = ?, priceOriginal = ?, barcode = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, price, priceOriginal, barcode, id]
    );

    // 🔹 Si hay proveedor_id, actualizar o insertar la relación
    if (proveedor_id) {
      const [existe] = await conn.query(
        `SELECT id FROM productos_test_proveedores WHERE producto_id = ?`,
        [id]
      );

      if (existe.length > 0) {
        // Ya existe → actualizar proveedor
        await conn.query(
          `UPDATE productos_test_proveedores 
           SET proveedor_id = ?, fecha_precio = NOW() 
           WHERE producto_id = ?`,
          [proveedor_id, id]
        );
      } else {
        // No existe → insertar nueva relación
        await conn.query(
          `INSERT INTO productos_test_proveedores (proveedor_id, producto_id, fecha_precio)
           VALUES (?, ?, NOW())`,
          [proveedor_id, id]
        );
      }
    }

    // 🔹 Devolver producto actualizado con nombre de proveedor
    const [[updated]] = await conn.query(
      `SELECT p.*, pr.nombre AS proveedor_nombre, r.proveedor_id
       FROM productos_test p
       LEFT JOIN productos_test_proveedores r ON r.producto_id = p.id
       LEFT JOIN proveedores pr ON pr.id = r.proveedor_id
       WHERE p.id = ?`,
      [id]
    );

    return updated;
  } finally {
    await conn.end();
  }
}
,

  /**
   * ✅ Marcar producto como chequeado
   */
  async markChecked(id) {
    const [result] = await pool.query(
      "UPDATE productos_test SET last_checked_at = NOW() WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  /**
   * 📋 Obtener productos filtrados (sin código o con precio > 500)
   */
  async getFiltered() {
    const [rows] = await pool.query(`
      SELECT id, name, priceOriginal, price, barcode, description 
      FROM productos_test
      WHERE barcode IS NOT NULL 
        AND TRIM(barcode) <> '' 
        AND (price > 500 OR price = 0)
      ORDER BY name ASC
    `);
    return rows;
  },

  /**
   * 🚫 Obtener productos no actualizados
   */
  async getNotUpdated() {
    const [rows] = await pool.query(`
      SELECT id, name, priceOriginal, price, barcode, description, updated_at 
      FROM productos_test
      WHERE 
        (
          price = 999 
          OR price = 0 
          OR name LIKE '%(CH)%' 
          OR name LIKE '%?%'
        )
        OR 
        (barcode IS NULL OR TRIM(barcode) = '')
      ORDER BY name ASC
    `);
    return rows;
  },

  /**
   * 📦 Obtener productos con código de barra
   */
  async getWithBarcode() {
    const [rows] = await pool.query(`
      SELECT id, name, priceOriginal, price, barcode, description, status
      FROM productos_test
      WHERE barcode IS NOT NULL 
        AND TRIM(barcode) <> ''
      ORDER BY name ASC
    `);
    return rows;
  }
};
