import { pool } from "../config/db.js";

const BATCH_SIZE = 500; // 👈 cantidad de productos por tanda
const FACTOR = 0.77; // 👈 23% menos
const DELAY_MS = 2000; // 👈 pausa de 2 segundos entre tandas

async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function updatePorTandas() {
  try {
    // 1️⃣ obtenemos el total de productos
    const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM productos_test WHERE price > 0");
    const total = countRows[0].total;
    console.log(`📦 Total de productos a actualizar: ${total}`);

    const tandas = Math.ceil(total / BATCH_SIZE);

    for (let i = 0; i < tandas; i++) {
      console.log(`\n🔄 Procesando tanda ${i + 1}/${tandas}...`);

      const [rows] = await pool.query(
        `SELECT id FROM productos_test WHERE price > 0 ORDER BY id ASC LIMIT ? OFFSET ?`,
        [BATCH_SIZE, i * BATCH_SIZE]
      );

      if (rows.length === 0) break;

      const ids = rows.map((r) => r.id);

      await pool.query(
        `UPDATE productos_test SET priceOriginal = ROUND(price * ?, 2) WHERE id IN (${ids.join(",")})`,
        [FACTOR]
      );

      console.log(`✅ Tanda ${i + 1} completada (${ids.length} productos actualizados).`);

      if (i < tandas - 1) {
        console.log(`⏸️ Esperando ${DELAY_MS / 1000}s antes de continuar...`);
        await delay(DELAY_MS);
      }
    }

    console.log("\n🎯 Proceso completado con éxito.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error durante la actualización:", err);
    process.exit(1);
  }
}

updatePorTandas();
