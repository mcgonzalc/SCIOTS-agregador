import { modPow, modInv } from "bigint-crypto-utils";

const ENERGETICA = "http://localhost:3000";
const AGREGADOR = "http://localhost:3001";

async function testBlindSignature() {
    // 1. Obtener clave pública de Energética
    const pubKeyRes = await fetch(`${ENERGETICA}/pubKey`);
    const { n: nStr, e: eStr } = await pubKeyRes.json() as { n: string; e: string };
    const n = BigInt(nStr);
    const e = BigInt(eStr);
    console.log("[1] Clave pública obtenida");

    // 2. Cegar el consumo
    const consumo = 350n; // kWh — cambia este valor para probar distintos consumos
    const r = 7919n;     // factor de cegado (en producción sería aleatorio y coprimo con n)
    const blinded = (consumo * modPow(r, e, n)) % n;
    console.log("[2] Valor cegado calculado");

    // 3. Enviar a Energética para firma ciega
    const blindSignRes = await fetch(`${ENERGETICA}/blindsign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blinded: blinded.toString() }),
    });
    const { blindSig: blindSigStr } = await blindSignRes.json() as { blindSig: string };
    const blindSig = BigInt(blindSigStr);
    console.log("[3] Firma ciega recibida");

    // 4. Descejar la firma
    const rInv = modInv(r, n);
    const firma = (blindSig * rInv) % n;
    console.log("[4] Firma descegada — Energética nunca vio el consumo real");
    console.log("\n--- Copia esto en Thunderclient POST /consumosign ---");
    console.log(JSON.stringify({ consumo: consumo.toString(), firma: firma.toString() }, null, 2));
    console.log("----------------------------------------------------\n");

    // 5. Enviar consumo anónimo al Agregador
    const consumoSignRes = await fetch(`${AGREGADOR}/consumosign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consumo: consumo.toString(), firma: firma.toString() }),
    });
    const consumoResult = await consumoSignRes.json();
    console.log("[5] Consumo registrado:", consumoResult);

    // 6. Consultar estadísticas
    const statsRes = await fetch(`${AGREGADOR}/stats`);
    const stats = await statsRes.json();
    console.log("[6] Estadísticas:", stats);
}

testBlindSignature().catch(console.error);
