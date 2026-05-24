import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
    consumo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export interface IMeasurement extends mongoose.Document {
    consumo: string;
    createdAt: Date;
}

export default mongoose.model("Measurement", measurementSchema);