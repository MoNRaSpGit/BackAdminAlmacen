import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";





const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// ✅ Rutas
app.use("/api/products", productRoutes);
app.use("/api/proveedores", proveedorRoutes);

// healthcheck opcional
app.get("/", (req, res) => {
  res.send("✅ API de AdminAlmacén funcionando");
});

export default app;
