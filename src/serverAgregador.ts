import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import agregadorRoutes from "./routes/agregadorRoutes.js";
import { RsaPublicKey } from "rsa";

dotenv.config({ quiet: true });

const app = express();
const port = 3001;

app.use(express.json());

// Permitir que el frontend de Externa llamar a esta API
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Consigue public key del servidor de Energetica
const getEnergeticaPublicKey = async (): Promise<RsaPublicKey | null> => {
  try {
    const response = await fetch("http://localhost:4000/pubKey");
    const data = await response.json();
    return new RsaPublicKey(BigInt(data.n), BigInt(data.e));
  } catch (error) {
    console.error("Error fetching energetica public key:", error);
    return null;
  }
};

// Consigue public key del servidor Externa
const getExternaPublicKey = async (): Promise<RsaPublicKey | null> => {
  try {
    const response = await fetch("http://localhost:5000/pubKey");
    const data = await response.json();
    return new RsaPublicKey(BigInt(data.n), BigInt(data.e));
  } catch (error) {
    console.error("Error fetching externa public key:", error);
    return null;
  }
};

// Obtener la clave pública de Externa y de Energética
export const externaPublicKey = await getExternaPublicKey();
export const energeticaPublicKey = await getEnergeticaPublicKey();

// Rutas Rest
app.use("/", agregadorRoutes);

// Rutas de prueba
app.get("/", (_req, res) => {
  res.send("welcome to the agregador!");
});
app.post("/", (_req, res) => {
  res.send("good post to the agregador");
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/SCIOTS-Agregador")
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error("DB Connection Error:", error));

app.listen(port, () => {
  console.log(`Agregador API listening at http://localhost:${port}`);
});