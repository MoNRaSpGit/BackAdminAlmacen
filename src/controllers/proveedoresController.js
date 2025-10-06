import { pool } from "../config/db.js";

export async function getProveedores(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, contacto FROM proveedores ORDER BY nombre ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando proveedores:", err);
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
}
