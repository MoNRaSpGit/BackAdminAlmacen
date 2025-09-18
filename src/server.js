import app from './app.js';
import { PORT } from './config/env.js';
import { testConnection } from './config/db.js';

async function startServer() {
  const ok = await testConnection();
  if (!ok) {
    console.error('❌ No se pudo conectar a la base de datos. Abortando...');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 BackAdminAlmacen corriendo en http://localhost:${PORT}`);
  });
}

startServer();
