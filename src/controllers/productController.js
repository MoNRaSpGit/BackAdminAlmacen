import { pool } from "../config/db.js";

/**
 * Obtener todos los productos
 */
export async function getProducts(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, price, barcode, description FROM products"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos:", err);
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
      "SELECT name, price FROM products WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    const current = rows[0];

    // Si no llega name o price, usamos el actual
    const newName = name || current.name;
    const newPrice = price || current.price;

    await pool.query("UPDATE products SET name=?, price=? WHERE id=?", [
      newName,
      newPrice,
      id,
    ]);

    res.json({ id, name: newName, price: newPrice });
  } catch (err) {
    console.error("❌ Error actualizando producto:", err);
    res
      .status(500)
      .json({ error: "Error al actualizar producto", details: err.message });
  }
}

/**
 * Obtener productos con código de barra y precio > 500 o igual a 0
 */
export async function getFilteredProducts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, barcode, description 
       FROM products 
       WHERE barcode IS NOT NULL 
         AND TRIM(barcode) <> '' 
         AND (price > 500 OR price = 0)`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos filtrados:", err);
    res
      .status(500)
      .json({ error: "Error al obtener productos filtrados", details: err.message });
  }
}
