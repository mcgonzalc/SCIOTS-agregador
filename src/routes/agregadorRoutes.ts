import express from "express";
import { consumoSignHandler, getStatsHandler } from "../controllers/measurementController.js";
import { createAgregadorHandler,sendAgregadorDataHandler } from "../controllers/agregadorController.js";

const router = express.Router();

router.post("/data", createAgregadorHandler);
router.post("/send", sendAgregadorDataHandler);
router.post("/consumosign", consumoSignHandler);
router.get("/stats", getStatsHandler);

export default router;