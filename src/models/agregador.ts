import mongoose from "mongoose";

const agregadorSchema = new mongoose.Schema({
  c: { type: BigInt, required: true },
});

export interface IAgregador extends mongoose.Document {
  c: bigint;
}

export default mongoose.model("Agregador", agregadorSchema);