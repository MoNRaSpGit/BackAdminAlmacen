import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Pong desde BackAdminAlmacen 🚀" });
});

export default router;
