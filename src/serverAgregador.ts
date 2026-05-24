import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import agregadorRoutes from "./routes/agregadorRoutes.js";
import {publicKey,privateKey,publicKeyJson,privateKeyJson} from "./generateKeys.js";
import { RsaPublicKey } from "rsa";

dotenv.config({ quiet: true });

const app = express();
const port = 3001;

app.use(express.json());

// Consigue public key del servidor de Energetica
const getEnergeticaPublicKey = async (): Promise<RsaPublicKey | null> => {
  try {
    const response = await fetch("http://localhost:3000/pubKey");
    const data = await response.json();
    return new RsaPublicKey(BigInt(data.n), BigInt(data.e));
  } catch (error) {
    console.error("Error fetching public key:", error);
    return null;
  }
};
// Obtener la clave pública de Energetica antes de conectar a la DB
export const energeticaPublicKey = await getEnergeticaPublicKey();


// Rutas Rest
app.use("/", agregadorRoutes);

//Rutas de prueba
app.get("/", (_req,res) => {
  res.send(("welcome to the PD G3 Backend!"));
})
app.post("/", (_req,res) => {
  res.send(("good post to the PD G3 Backend!"));
})


mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SCIOTS-Agregador')
    .then(() => console.log('Connected to DB'))
    .catch((error) => console.error('DB Connection Error:', error));

app.listen(port, () => {
  console.log(`DroneApp API listening at http://localhost:${port}`);
});

