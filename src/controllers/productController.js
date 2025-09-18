import { pool } from "../config/db.js";

export async function getProducts(req, res) {
  try {
    const [rows] = await pool.query("SELECT id, name, price, barcode, description FROM products");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}
