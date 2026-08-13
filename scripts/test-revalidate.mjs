/**
 * Simula el aviso que Sanity envía al publicar, firmado igual que el real.
 *
 *   node --env-file=.env.local scripts/test-revalidate.mjs project ermita
 *
 * Sirve para probar la revalidación en local, donde Sanity no puede llegar a
 * localhost. Firma el cuerpo con el mismo secreto y el mismo algoritmo que
 * usa Sanity, así que lo que se ejercita es exactamente el mismo camino:
 * verificación de firma, mapa de dependencias y revalidateTag.
 */

import { createHmac } from "node:crypto";

const [type = "project", slug] = process.argv.slice(2);
const secret = process.env.SANITY_REVALIDATE_SECRET;
const url =
  process.env.REVALIDATE_URL ?? "http://localhost:3000/api/revalidate";

if (!secret) {
  console.error("Falta SANITY_REVALIDATE_SECRET en .env.local");
  process.exit(1);
}

const payload = JSON.stringify({
  _type: type,
  ...(slug ? { slug: { current: slug } } : {}),
});

/**
 * Formato de firma de Sanity: "t=<timestamp>,v1=<hmac base64url>", donde el
 * hmac se calcula sobre "<timestamp>.<cuerpo>".
 */
const timestamp = Date.now();
const signature = createHmac("sha256", secret)
  .update(`${timestamp}.${payload}`)
  .digest("base64url");

const res = await fetch(url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "sanity-webhook-signature": `t=${timestamp},v1=${signature}`,
  },
  body: payload,
});

console.log(`  ${res.status} ${res.statusText}`);
console.log(" ", await res.text());
