/**
 * Un único sitio donde se leen las variables de Sanity, para que el resto del
 * código no repita nunca `process.env`.
 *
 * `projectId` y `dataset` son públicos a propósito: viajan al navegador en
 * cada petición de imagen, no son secretos. El token de escritura NO está
 * aquí — vive solo en los scripts de migración (ver scripts/migrate.ts), que
 * corren en tu máquina y nunca se empaquetan en la web.
 */

/**
 * Falla con un mensaje que dice qué falta y dónde ponerlo, en vez del
 * "Configuration must contain projectId" de Sanity, que no dice nada.
 */
function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. En local va en .env.local; ` +
        `en Vercel, en Settings → Environment Variables.`,
    );
  }
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

/**
 * Fecha fija, no "latest": clava el comportamiento de la API para que un
 * cambio en Sanity no altere las respuestas de una web ya desplegada.
 */
export const apiVersion = "2026-08-12";
