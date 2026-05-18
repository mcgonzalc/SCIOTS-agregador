import ConsumoAnonimo from "../models/consumoAnonimo.js";

export const saveConsumo = async (consumo: bigint) => {
    const doc = new ConsumoAnonimo({ consumo: consumo.toString() });
    return await doc.save();
};

export const getStats = async () => {
    const docs = await ConsumoAnonimo.find({}, "consumo");
    const values = docs.map(d => BigInt(d.consumo));
    if (values.length === 0) return { count: 0, mean: "0", min: "0", max: "0" };
    const sum = values.reduce((a, b) => a + b, 0n);
    const min = values.reduce((a, b) => (a < b ? a : b));
    const max = values.reduce((a, b) => (a > b ? a : b));
    return {
        count: values.length,
        mean: (sum / BigInt(values.length)).toString(),
        min: min.toString(),
        max: max.toString(),
    };
};
