import { pool } from "../config/db.js";

/**
 * Normaliza un texto:
 * - pasa a minúsculas
 * - elimina tildes
 * - elimina caracteres especiales
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")              // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // borra acentos
    .replace(/[^a-z0-9\s]/g, "")     // borra caracteres raros
    .trim();
}

/**
 * Obtener todos los productos
 */
export async function getProducts(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, price, barcode, description, status, updated_at FROM productos_test"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos (productos_test):", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

/**
 * Actualizar producto (nombre y precio)
 */
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    // Traemos el producto actual
    const [rows] = await pool.query(
      "SELECT name, price FROM productos_test WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    const current = rows[0];

    // Si no llega name o price, usamos el actual
    const newName = name || current.name;
    const newPrice = price || current.price;

    await pool.query("UPDATE productos_test SET name=?, price=? WHERE id=?", [
      newName,
      newPrice,
      id,
    ]);

    res.json({ id, name: newName, price: newPrice });
  } catch (err) {
    console.error("❌ Error actualizando producto (productos_test):", err);
    res.status(500).json({ error: "Error al actualizar producto", details: err.message });
  }
}

/**
 * Obtener productos con código de barra y precio > 500 o igual a 0
 */
export async function getFilteredProducts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, barcode, description 
       FROM productos_test
       WHERE barcode IS NOT NULL 
         AND TRIM(barcode) <> '' 
         AND (price > 500 OR price = 0)`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos filtrados (productos_test):", err);
    res.status(500).json({ error: "Error al obtener productos filtrados", details: err.message });
  }
}

/**
 * Insertar producto nuevo
 */
export async function addProduct(req, res) {
  const { name, price, barcode, description } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO productos_test (name, price, barcode, description) VALUES (?, ?, ?, ?)",
      [name, price || 0, barcode || null, description || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
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
 * Obtener productos que tienen código de barra
 */
export async function getProductsConBarcode(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, barcode, description, status
       FROM productos_test
       WHERE barcode IS NOT NULL 
         AND TRIM(barcode) <> ''`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos con código de barra (productos_test):", err);
    res.status(500).json({ error: "Error al obtener productos con código de barra" });
  }
}

/**
 * Obtener productos NO actualizados (pero con código de barra)
 */
export async function getNotUpdatedProducts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, barcode, description, updated_at 
       FROM productos_test
       WHERE (barcode IS NOT NULL AND TRIM(barcode) <> '') -- 👈 solo con código
         AND (price = 999 OR price = 0 OR name LIKE '%(CH)%')`
    );
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
      "SELECT id, name, price, barcode, image, description FROM productos_test WHERE barcode = ?",
      [barcode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error consultando producto por código (productos_test):", err);
    res.status(500).json({ error: "Error al obtener producto por código" });
  }
}
