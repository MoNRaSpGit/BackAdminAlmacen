import 'dotenv/config';

// Puerto (Render asigna dinámicamente el valor)
export const PORT = process.env.PORT;

// Soporte para varios orígenes CORS
const origins =
  (process.env.CORS_ORIGIN || process.env.CLIENT_ORIGIN || 'http://localhost:5173,https://monraspgit.github.io')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

export const CORS_ORIGINS = origins;
export const CLIENT_ORIGIN = origins[0];

// Config DB
export const DB = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: /^(1|true|yes)$/i.test(process.env.DB_SSL || '') ? { rejectUnauthorized: false } : undefined,
};
