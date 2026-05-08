import Agregador, { IAgregador } from "../models/agregador.js";
import { energeticaPublicKey } from "../serverAgregador.js";

export const createAgregador = async (agregadorData: { c: string | number | bigint }) => {
    const encryptedData = energeticaPublicKey?.encrypt(BigInt(agregadorData.c));
    const agregadordata = new Agregador({ c: encryptedData?.toString() });
    return await agregadordata.save();
};


export const sendAgregadorData = async () => {
    if (!energeticaPublicKey) throw new Error("Energetica public key not available");

    const agregadoresData = await Agregador.find();

    const results = await Promise.all(
        agregadoresData.map(async (item) => {
            const response = await fetch("http://localhost:3000/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ c: item.c }),
            });
            return response.json();
        })
    );

    await Agregador.deleteMany();
    return results;
};