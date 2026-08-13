import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Cliente de solo lectura, el único que usa la web.
 *
 * `useCdn: false` a propósito. Parece contraintuitivo en producción, pero la
 * web no consulta a Sanity en cada visita: las páginas se sirven ya
 * renderizadas desde la caché de ruta, y esta consulta solo corre cuando una
 * página se regenera. En ese momento lo que hace falta es el dato de verdad,
 * no una copia de la CDN — que es lo que impedía que un cambio publicado se
 * viera hasta pasada la hora.
 *
 * No lleva token: el dataset es público, así que la web lee sin credenciales.
 * Eso es deliberado — un token en el cliente acabaría en el navegador.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
