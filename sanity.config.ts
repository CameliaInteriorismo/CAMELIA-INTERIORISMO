"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { SINGLETON_TYPES, schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

/**
 * El panel de Sanity, embebido en la propia web en /studio. Un solo
 * repositorio y un solo despliegue: entras con tu cuenta de Sanity y editas.
 */
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Camelia",
  schema: {
    types: schemaTypes,
    /**
     * Los documentos únicos no se pueden crear ni duplicar desde ningún sitio
     * del panel — ni desde el botón global de "crear", ni desde el menú de un
     * documento abierto. Sin esto acabarías con dos Homes y la web leyendo
     * una de las dos al azar.
     */
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          !SINGLETON_TYPES.includes(
            schemaType as (typeof SINGLETON_TYPES)[number],
          ),
      ),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType as (typeof SINGLETON_TYPES)[number])
        ? actions.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    // Consola para probar consultas GROQ contra el contenido real.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
