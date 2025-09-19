import { pool } from "../config/db.js";
import stringSimilarity from "string-similarity";



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



/**
 * Buscar matches entre products (price=999/0) y productos_aux
 */
export async function getProductMatches(req, res) {
  try {
    // 1. Traemos los productos originales que necesitan actualización
    const [productosPendientes] = await pool.query(
      "SELECT id, name, price FROM products WHERE price = 999 OR price = 0"
    );

    // 2. Traemos los productos auxiliares
    const [productosAux] = await pool.query(
      "SELECT id, name, price FROM productos_aux"
    );

    let resultados = [];

    for (const prod of productosPendientes) {
      const nombresAux = productosAux.map((p) => normalizeText(p.name));
      const match = stringSimilarity.findBestMatch(normalizeText(prod.name), nombresAux);

      const best = match.bestMatch;
      const bestIndex = match.bestMatchIndex;
      const similitud = best.rating;

      if (similitud >= 0.7) { // 👈 umbral mínimo
        const candidato = productosAux[bestIndex];

        resultados.push({
          product_id: prod.id,
          product_name: prod.name,
          product_price: prod.price,
          aux_name: candidato.name,
          aux_price: candidato.price,
          score: similitud, // 0..1 (el front lo muestra en %)
        });
      }
    }

    res.json(resultados);
  } catch (err) {
    console.error("❌ Error generando matches:", err);
    res.status(500).json({ error: "Error generando matches", details: err.message });
  }
}
