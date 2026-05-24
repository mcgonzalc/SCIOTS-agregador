import { Request, Response } from "express";
import { saveMeasurement, getStats } from "../services/measurementServices.js";
import { energeticaPublicKey, externaPublicKey } from "../serverAgregador.js";
import { blindVerify, signMessage } from "rsa";

export const consumoSignHandler = async (req: Request, res: Response) => {
    try {
        const consumo = BigInt(req.body.consumo);
        const firma = BigInt(req.body.firma);
        if (!energeticaPublicKey) {
            res.status(503).json({ message: "Energetica public key not available" });
            return;
        }
        if (!blindVerify(consumo, firma, energeticaPublicKey)) {
            res.status(400).json({ message: "Invalid signature" });
            return;
        }
        const encrypted_measurememnt = await encryptMessage(consumo, externaPublicKey);
        const saved = await saveMeasurement(encrypted_measurememnt);
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
