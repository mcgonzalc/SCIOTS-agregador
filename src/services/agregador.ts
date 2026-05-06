import Agregador, { IAgregador } from "../models/agregador.js";
import { energeticaPublicKey } from "../serverAgregador.js";

export const createAgregador = async (agregadorData: { c: string | number | bigint }) => {
    const agregadordata = new Agregador({ c: BigInt(agregadorData.c).toString() });
    return await agregadordata.save();
};

export const sendAgregadorData = async () => {
    if (!energeticaPublicKey) throw new Error("Energetica public key not available");

    const agregadoresData = await Agregador.find();

    const results = await Promise.all(
        agregadoresData.map(async (item) => {
            const encrypted = energeticaPublicKey?.encrypt(BigInt(item.c));
            const response = await fetch("http://localhost:3000/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ c: encrypted?.toString() }),
            });
            return response.json();
        })
    );

    await Agregador.deleteMany();
    return results;
};