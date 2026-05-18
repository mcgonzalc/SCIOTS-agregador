import mongoose from "mongoose";

const consumoAnonimoSchema = new mongoose.Schema({
    consumo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export interface IConsumoAnonimo extends mongoose.Document {
    consumo: string;
    createdAt: Date;
}

export default mongoose.model("ConsumoAnonimo", consumoAnonimoSchema);
