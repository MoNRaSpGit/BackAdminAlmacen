import express from "express";
import { imprimirTicketPrueba } from "../controllers/printController.js";

const router = express.Router();

router.get("/print/prueba", imprimirTicketPrueba);

export default router;
