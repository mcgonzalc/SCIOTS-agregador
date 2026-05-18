import { Request, Response } from "express";
import { saveConsumo, getStats } from "../services/consumoAnonimo.js";
import { energeticaPublicKey } from "../serverAgregador.js";
import { verifyBlindSignature } from "../blindVerify.js";

export const consumoSignHandler = async (req: Request, res: Response) => {
    try {
        const consumo = BigInt(req.body.consumo);
        const firma = BigInt(req.body.firma);
        if (!energeticaPublicKey) {
            res.status(503).json({ message: "Energetica public key not available" });
            return;
        }
        if (!verifyBlindSignature(consumo, firma, energeticaPublicKey)) {
            res.status(400).json({ message: "Invalid signature" });
            return;
        }
        const saved = await saveConsumo(consumo);
        res.status(201).json({ message: "Consumo registrado", id: saved._id });
    } catch (error) {
        res.status(500).json({ message: "Error processing consumo", error });
    }
};

export const getStatsHandler = async (_req: Request, res: Response) => {
    try {
        const stats = await getStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error });
    }
};
