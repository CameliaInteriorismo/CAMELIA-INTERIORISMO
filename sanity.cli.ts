import { defineCliConfig } from "sanity/cli";

/**
 * Solo para las herramientas de línea de comandos de Sanity — en concreto
 * `sanity documents validate`, que comprueba los documentos guardados contra
 * los schemas con las mismas reglas que aplica el Studio. No interviene en la
 * web: el Studio embebido se configura en sanity.config.ts.
 *
 * Los identificadores no son secretos: son los mismos que ya viajan al
 * navegador como NEXT_PUBLIC_*.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
