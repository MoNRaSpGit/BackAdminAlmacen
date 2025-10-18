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

      // 🔹 1. Actualizamos el producto principal
      await conn.query(
        `UPDATE productos_test 
         SET name=?, price=?, priceOriginal=?, barcode=?, updated_at=NOW()
         WHERE id=?`,
        [name, price, priceOriginal, barcode, id]
      );

      // 🔹 2. Si vino un proveedor, actualizamos la tabla intermedia
      if (proveedor_id) {
        await conn.query(
          `INSERT INTO productos_test_proveedores (proveedor_id, producto_id, costo, fecha_precio)
           VALUES (?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE 
             costo = VALUES(costo),
             fecha_precio = NOW()`,
          [proveedor_id, id, priceOriginal]
        );
      }

      // ✅ 3. Devolvemos el resultado actualizado
      return { id, name, price, priceOriginal, barcode, proveedor_id };
    } catch (err) {
      console.error("❌ Error en ProductoModel.update:", err);
      throw err;
    } finally {
      await conn.end();
    }
  },


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
