import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * El único cliente con permiso de escritura, y solo para el contador de
 * números de solicitud (ver src/lib/requests/reference.ts).
 *
 * `server-only` en la primera línea a propósito: si algún día alguien importa
 * este módulo desde un componente de cliente, la compilación FALLA en vez de
 * empaquetar el token y mandarlo al navegador. Es la misma razón por la que
 * la variable no lleva `NEXT_PUBLIC_`.
 *
 * `useCdn: false` porque escribir contra una copia cacheada no tiene sentido,
 * y `perspective: "raw"` para que el contador se lea tal cual está, sin que
 * un borrador se cuele por medio.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "raw",
  token: process.env.SANITY_API_WRITE_TOKEN,
});

/**
 * Falla pronto y con un mensaje que dice qué falta. Sin esto, un token
 * ausente se manifiesta como un 401 de Sanity en mitad del envío, cuando la
 * persona ya ha pulsado el botón.
 */
export function assertWriteToken() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error(
      "Falta SANITY_API_WRITE_TOKEN: sin él no se puede emitir el número de solicitud.",
    );
  }
}
