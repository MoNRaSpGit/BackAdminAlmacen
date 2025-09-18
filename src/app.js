import express from "express";
import cors from "cors";
import pingRoutes from "./routes/pingRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

// Rutas
app.use("/api/ping", pingRoutes);

app.get("/", (req, res) => {
  res.send("✅ API de BackAdminAlmacen funcionando");
});

export default app;
