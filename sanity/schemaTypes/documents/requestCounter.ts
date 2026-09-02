import { defineField, defineType } from "sanity";

/**
 * El contador de números de solicitud. Un documento por serie y año:
 * `counter.PROD.2026`, `counter.PROY.2026`.
 *
 * Vive en Sanity porque hace falta un sitio con incremento ATÓMICO, y Vercel
 * no lo es: cada petición corre en su propia instancia, sin memoria ni disco
 * compartidos, así que un contador en el proceso daría números repetidos en
 * cuanto dos personas enviaran a la vez. El `inc` de Sanity lo resuelve en el
 * servidor, de modo que dos solicitudes simultáneas se llevan números
 * distintos sin que la web tenga que coordinar nada.
 *
 * NO guarda solicitudes: solo el último número usado. Ni un dato personal
 * entra aquí. Los datos del formulario viajan por correo y no se almacenan.
 *
 * No aparece en el panel: la barra lateral es una lista explícita (ver
 * sanity/structure.ts) y este tipo no está en ella. Los campos van en
 * `readOnly` por si alguien llega al documento por una URL directa —
 * cambiarlos a mano rompería la numeración.
 */
export const requestCounter = defineType({
  name: "requestCounter",
  title: "Contador de solicitudes",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "series",
      title: "Serie",
      type: "string",
      description: "PROD para tienda, PROY para proyectos.",
      readOnly: true,
    }),
    defineField({ name: "year", title: "Año", type: "number", readOnly: true }),
    defineField({
      name: "count",
      title: "Último número emitido",
      type: "number",
      readOnly: true,
    }),
  ],
  preview: {
    select: { series: "series", year: "year", count: "count" },
    prepare: ({ series, year, count }) => ({
      title: `${series}-${year}`,
      subtitle: `Último número: ${count}`,
    }),
  },
});
