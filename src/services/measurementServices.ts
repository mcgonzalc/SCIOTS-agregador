import Measurement from "../models/measurement.js";

/** Guarda el consumo YA cifrado con la pública de Externa. */
export const saveMeasurement = async (consumo: bigint) => {
    const doc = new Measurement({ consumo: consumo.toString() });
    return await doc.save();
};

/**
 * El consumo se guarda cifrado para Externa, así que el Agregador ya no puede
 * calcular media/min/max (RSA no es homomórfico aditivo). Devuelve la lista de
 * consumos cifrados + el recuento; será Externa quien los descifre con su
 * privada y calcule las estadísticas.
 */
export const getStats = async () => {
    const docs = await Measurement.find({}, "consumo");
    const consumos = docs.map(d => d.consumo);
    return { count: consumos.length, consumos };
};