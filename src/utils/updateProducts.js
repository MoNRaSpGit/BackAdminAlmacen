import { pool } from "../config/db.js";
import stringSimilarity from "string-similarity";

async function actualizarProductos() {
  try {
    // 1. Traemos productos con precio 999 o 0
    const [productosPendientes] = await pool.query(
      "SELECT id, name, price FROM products WHERE price = 999 OR price = 0"
    );

    // 2. Traemos la lista auxiliar
    const [productosAux] = await pool.query(
      "SELECT id, name, price FROM productos_aux"
    );

    console.log(`🔎 ${productosPendientes.length} productos pendientes a revisar`);
    console.log(`📥 ${productosAux.length} productos auxiliares cargados`);

    let actualizados = 0;
    let pendientes = [];

    // 3. Para cada producto pendiente, buscamos el mejor match
    for (const prod of productosPendientes) {
      const nombresAux = productosAux.map((p) => p.name);
      const match = stringSimilarity.findBestMatch(prod.name, nombresAux);

      // Mejor coincidencia
      const best = match.bestMatch;
      const bestIndex = match.bestMatchIndex;
      const similitud = best.rating; // de 0 a 1

      if (similitud >= 0.8) {
        const nuevoPrecio = productosAux[bestIndex].price;

        // Hacemos el update en la DB
        await pool.query("UPDATE products SET price = ? WHERE id = ?", [
          nuevoPrecio,
          prod.id,
        ]);

        console.log(
          `✅ [${prod.id}] "${prod.name}" → match con "${productosAux[bestIndex].name}" (score ${(
            similitud * 100
          ).toFixed(1)}%). Nuevo precio: ${nuevoPrecio}`
        );

        actualizados++;
      } else {
        // Guardamos para revisión manual
        pendientes.push({
          id: prod.id,
          name: prod.name,
          mejorCoincidencia: productosAux[bestIndex].name,
          score: similitud,
        });
      }
    }

    console.log(`\n✅ Actualizados automáticamente: ${actualizados}`);
    console.log(`⚠️ Pendientes de revisión: ${pendientes.length}`);

    // Mostramos algunos pendientes
    console.log("\n🔎 Ejemplos de pendientes:");
    pendientes.slice(0, 10).forEach((p) => {
      console.log(
        ` - [${p.id}] "${p.name}" ~ "${p.mejorCoincidencia}" (score ${(p.score * 100).toFixed(1)}%)`
      );
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error en actualización masiva:", err);
    process.exit(1);
  }
}

actualizarProductos();
