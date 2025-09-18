import express from "express";
import cors from "cors";
import pingRoutes from "./routes/pingRoutes.js"; // 👈 ESTA LÍNEA FALTABA

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/ping", pingRoutes);

app.get("/", (req, res) => {
  res.send("✅ API de BackAdminAlmacen funcionando");
});

export default app;
