import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/ping", pingRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API de BackAdminAlmacen funcionando');
});

export default app;
