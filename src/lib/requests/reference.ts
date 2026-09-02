import "server-only";
import { assertWriteToken, writeClient } from "@/sanity/lib/writeClient";

/** Las dos series, con contadores independientes entre sí y por año. */
export type Series = "PROD" | "PROY";

/**
 * Emite el siguiente número de una serie: `PROD-2026-0001`.
 *
 * El contador vive en un documento de Sanity —uno por serie y año, de ahí que
 * PROD y PROY nunca se pisen— y se incrementa con `inc`. Eso es lo que
 * importa: `inc` lo resuelve el servidor de Sanity sobre el valor actual, no
 * la web sobre uno que leyó antes. Si dos personas envían a la vez, cada
 * petición aplica su propio incremento y cada una se lleva un número
 * distinto. Leer-sumar-escribir desde aquí sí habría dado repetidos.
 *
 * `createIfNotExists` deja el documento a cero la primera vez del año y no
 * hace nada las siguientes, así que el 1 de enero la serie empieza sola.
 *
 * Se llama después de validar y después de comprobar la configuración de
 * correo, para que una solicitud que no va a poder enviarse no gaste un
 * número y deje un hueco en la serie.
 */
export async function nextReference(series: Series): Promise<string> {
  assertWriteToken();

  const year = new Date().getFullYear();
  const id = `counter.${series}.${year}`;

  await writeClient.createIfNotExists({
    _id: id,
    _type: "requestCounter",
    series,
    year,
    count: 0,
  });

  const updated = await writeClient
    .patch(id)
    .inc({ count: 1 })
    .commit<{ count: number }>({ returnDocuments: true });

  const count = updated?.count;
  if (typeof count !== "number" || !Number.isFinite(count)) {
    throw new Error(`El contador ${id} no devolvió un número al incrementarse.`);
  }

  // Cuatro cifras, como pide el formato. Si algún año pasara de 9999 deja de
  // rellenar en vez de cortar: mejor un número más largo que uno repetido.
  return `${series}-${year}-${String(count).padStart(4, "0")}`;
}
