import express from "express";
import cors from "cors";
import pingRoutes from "./routes/pingRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Todas las rutas de productos empiezan con /api/products
app.use("/api/products", productRoutes);

// ✅ Ruta ping
app.use("/api/ping", pingRoutes);

// ✅ Ruta raíz
app.get("/", (req, res) => {
  res.send("✅ API de BackAdminAlmacen funcionando");
});

export default app;
