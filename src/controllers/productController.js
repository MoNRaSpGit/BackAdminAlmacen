import mysql from "mysql2/promise";
import { pool } from "../config/db.js";
import { DB } from "../config/env.js";

/**
 * Normaliza un texto:
 * - pasa a minúsculas
 * - elimina tildes
 * - elimina caracteres especiales
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/**
 * Obtener todos los productos
 */
export async function getProducts(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.priceOriginal, p.price, p.barcode, p.description,
             p.status, p.updated_at, p.last_checked_at,
             pp.proveedor_id, pr.nombre AS proveedor_nombre
      FROM productos_test p
      LEFT JOIN proveedor_producto pp ON pp.producto_id = p.id
      LEFT JOIN proveedores pr ON pr.id = pp.proveedor_id
      ORDER BY p.name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}


/**
 * 🔧 Actualizar producto (nombre, precios y código)
 */
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price, priceOriginal, barcode } = req.body;

  let conn;
  try {
    // Crear conexión directa (evita locks persistentes del pool)
    conn = await mysql.createConnection(DB);

    // Reducir tiempo de espera de locks
    await conn.query("SET innodb_lock_wait_timeout = 5");

    // Ejecutar el update
    await conn.query(
      `UPDATE productos_test 
       SET name = ?, 
           price = ?, 
           priceOriginal = ?, 
           barcode = ?, 
           updated_at = NOW() 
       WHERE id = ?`,
      [name, price, priceOriginal, barcode, id]
    );

    res.json({ id, name, price, priceOriginal, barcode });
  } catch (err) {
    console.error("❌ Error actualizando producto (productos_test):", err);
    res
      .status(500)
      .json({ error: "Error al actualizar producto", details: err.message });
  } finally {
    if (conn) await conn.end();
  }
}

/**
 * Obtener productos con código de barra y precio > 500 o igual a 0
 */
export async function getFilteredProducts(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, priceOriginal, price, barcode, description 
      FROM productos_test
      WHERE barcode IS NOT NULL 
        AND TRIM(barcode) <> '' 
        AND (price > 500 OR price = 0)
      ORDER BY name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos filtrados (productos_test):", err);
    res.status(500).json({
      error: "Error al obtener productos filtrados",
      details: err.message,
    });
  }
}

/**
 * Insertar producto nuevo
 */
export async function addProduct(req, res) {
  const { name, price, priceOriginal, barcode, description } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO productos_test 
        (name, priceOriginal, price, barcode, description, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, priceOriginal || 0, price || 0, barcode || null, description || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      priceOriginal,
      price,
      barcode,
      description,
    });
  } catch (err) {
    console.error("❌ Error insertando producto (productos_test):", err);
    res.status(500).json({ error: "Error al insertar producto" });
  }
}

/**
 * Obtener productos con código de barra
 */
export async function getProductsConBarcode(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, priceOriginal, price, barcode, description, status
      FROM productos_test
      WHERE barcode IS NOT NULL 
        AND TRIM(barcode) <> ''
      ORDER BY name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos con código de barra (productos_test):", err);
    res.status(500).json({ error: "Error al obtener productos con código de barra" });
  }
}

/**
 * Obtener productos NO actualizados
 */
export async function getNotUpdatedProducts(req, res) {
  try {
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
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos no actualizados (productos_test):", err);
    res.status(500).json({ error: "Error al obtener productos no actualizados" });
  }
}

/**
 * Buscar producto por código de barras
 */
export async function getProductByBarcode(req, res) {
  const { barcode } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, name, priceOriginal, price, barcode, image, description 
       FROM productos_test 
       WHERE barcode = ?`,
      [barcode]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error consultando producto por código (productos_test):", err);
    res.status(500).json({ error: "Error al obtener producto por código" });
  }
}

export async function marcarProductoChequeado(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "UPDATE productos_test SET last_checked_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ success: true, id, last_checked_at: new Date() });
  } catch (err) {
    console.error("❌ Error marcando producto como chequeado:", err);
    res.status(500).json({ error: "Error al marcar producto" });
  }
}

