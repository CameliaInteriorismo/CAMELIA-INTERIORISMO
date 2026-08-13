import { defineField, defineType } from "sanity";

/**
 * SEO reutilizable, presente en toda página o ficha con URL propia.
 *
 * Todos los campos son opcionales a propósito. La web ya tiene un title y una
 * description para cada una de sus 21 rutas, y esos textos siguen en el código
 * como valor por defecto: si dejas esto vacío, el SEO actual se mantiene
 * exactamente igual. Solo lo que rellenes aquí lo sustituye.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Título en Google y en la pestaña",
      type: "string",
      description:
        "Si lo dejas vacío se usa el título de la página. Lo ideal son 50–60 caracteres.",
      validation: (rule) =>
        rule
          .max(70)
          .warning("Por encima de 70 caracteres Google suele cortarlo."),
    }),
    defineField({
      name: "description",
      title: "Descripción en Google",
      type: "text",
      rows: 3,
      description: "Lo ideal son 120–160 caracteres.",
      validation: (rule) =>
        rule
          .max(180)
          .warning("Por encima de 180 caracteres Google suele cortarla."),
    }),
    defineField({
      name: "ogTitle",
      title: "Título al compartir (redes)",
      type: "string",
      description: "Si lo dejas vacío se usa el título de arriba.",
    }),
    defineField({
      name: "ogDescription",
      title: "Descripción al compartir (redes)",
      type: "text",
      rows: 2,
      description: "Si la dejas vacía se usa la descripción de arriba.",
    }),
    defineField({
      name: "ogImage",
      title: "Imagen al compartir (redes)",
      type: "image",
      description:
        "La imagen que sale en WhatsApp, LinkedIn o X al pegar el enlace. Proporción 1200×630.",
      options: { hotspot: true },
    }),
  ],
});
