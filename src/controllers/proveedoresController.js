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

// 🆕 asignar productos a un proveedor
export async function asignarProductosAProveedor(req, res) {
  const { proveedorId, productos } = req.body;

  if (!proveedorId || !Array.isArray(productos)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    for (const productoId of productos) {
      await pool.query(
        `INSERT INTO productos_test_proveedores (proveedor_id, producto_id, costo)
         VALUES (?, ?, 0)
         ON DUPLICATE KEY UPDATE proveedor_id = VALUES(proveedor_id)`,
        [proveedorId, productoId]
      );
    }

    res.json({ message: "Productos asignados correctamente" });
  } catch (err) {
    console.error("❌ Error asignando productos:", err);
    res.status(500).json({ error: "Error al asignar productos" });
  }
}




// Productos que aún no tienen proveedor
export async function getProductosSinProveedor(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.price, p.barcode, p.description, p.image
      FROM productos_test p
      LEFT JOIN productos_test_proveedores r ON r.producto_id = p.id
      WHERE r.producto_id IS NULL
      ORDER BY p.name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos sin proveedor:", err);
    res.status(500).json({ error: "Error al obtener productos sin proveedor" });
  }
}


export async function getProductosPorProveedor(req, res) {
  const { proveedorId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.barcode, p.description
       FROM productos_test p
       INNER JOIN productos_test_proveedores r ON r.producto_id = p.id
       WHERE r.proveedor_id = ?`,
      [proveedorId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error consultando productos por proveedor:", err);
    res.status(500).json({ error: "Error al obtener productos por proveedor" });
  }
}



