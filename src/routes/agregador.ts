import express from "express";
import { createAgregadorHandler, sendAgregadorDataHandler } from "../controllers/agregador.js";
import { consumoSignHandler, getStatsHandler } from "../controllers/consumoAnonimo.js";

const router = express.Router();

router.post("/data", createAgregadorHandler);
router.post("/send", sendAgregadorDataHandler);
router.post("/consumosign", consumoSignHandler);
router.get("/stats", getStatsHandler);

export default router;