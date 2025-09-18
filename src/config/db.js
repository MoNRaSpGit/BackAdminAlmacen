import mysql from 'mysql2/promise';
import { DB } from './env.js';

const base = {
  host: DB.host,
  port: DB.port,
  user: DB.user,
  password: DB.password,
  database: DB.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(DB.ssl ? { ssl: DB.ssl } : {}), // solo si hay SSL
};

export const pool = mysql.createPool(base);

export async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping(); // prueba rápida
    console.log('✅ Conectado correctamente a MySQL');
    return true;
  } catch (err) {
    console.error('❌ Error de conexión MySQL:', err.message);
    return false;
  } finally {
    conn.release();
  }
}
