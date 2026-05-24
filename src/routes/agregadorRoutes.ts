import express from "express";
import { consumoSignHandler, getStatsHandler } from "../controllers/consumoAnonimo.js";
import { createAgregadorHandler,sendAgregadorDataHandler } from "../controllers/agregadorController.js";

const router = express.Router();

router.post("/data", createAgregadorHandler);
router.post("/send", sendAgregadorDataHandler);
router.post("/consumosign", consumoSignHandler);
router.get("/stats", getStatsHandler);

export default router;