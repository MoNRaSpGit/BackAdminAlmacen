import { pool } from "../config/db.js";

async function actualizarPriceOriginal() {
  console.log("🚀 Iniciando actualización de priceOriginal...");

  const [rows] = await pool.query("SELECT id, price FROM productos_test WHERE price > 0");
  const productos = rows;
  console.log(`📦 Productos a procesar: ${productos.length}`);

  let procesados = 0;

  for (const prod of productos) {
    const nuevoPriceOriginal = Math.round(prod.price * 0.77 * 100) / 100;

    try {
      await pool.query("UPDATE productos_test SET priceOriginal = ? WHERE id = ?", [
        nuevoPriceOriginal,
        prod.id,
      ]);
      procesados++;
      if (procesados % 100 === 0) {
        console.log(`✅ ${procesados} productos actualizados...`);
        await new Promise((res) => setTimeout(res, 200)); // pausa corta
      }
    } catch (err) {
      console.error(`❌ Error en producto ${prod.id}:`, err.message);
    }
  }

  console.log(`🎯 Proceso finalizado. Total actualizados: ${procesados}`);
  await pool.end();
  process.exit(0);
}

actualizarPriceOriginal().catch((e) => {
  console.error("❌ Error general:", e);
  process.exit(1);
});
