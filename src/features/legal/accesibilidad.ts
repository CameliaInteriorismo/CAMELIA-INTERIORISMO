/**
 * Accesibilidad Web, transcribed verbatim from the text the studio supplied
 * — same rule as the other three legal documents.
 *
 * Worth keeping on record: the claims here were measured against the site
 * before the first draft went out, and the numbers still hold.
 *
 * - Contrast figures are measured, not asserted. Body copy (text-primary/75
 *   on the cream ground) is 8.4:1 and the full-strength vino is 17.2:1,
 *   both well past WCAG AA. The lighter tints used for secondary lines
 *   (/55, /50, /45) and field placeholders (/35) fall between 3.1:1 and
 *   2.3:1, below the 4.5:1 AA threshold — which is why clause 4 says so
 *   plainly instead of claiming blanket "contrastes adecuados".
 * - Reduced motion is honoured by the menu, the route transition, the form
 *   steps, the marquees and the cookie banner, but not yet by the
 *   accordions, tabs or card hovers. Clause 3 claims only the former.
 * - No external audit has been run, so nothing here claims conformance to
 *   a WCAG level. An accessibility statement that overclaims is worse than
 *   none: it tells a disabled visitor not to bother reporting a problem.
 */

import type { LegalSection } from "@/features/legal/types";

export const ACCESIBILIDAD_LEAD = [
  "En Camelia diseñamos espacios para que se habiten con comodidad. Esta web debería funcionar igual: queremos que cualquier persona pueda recorrerla, entender lo que contamos y ponerse en contacto con nosotros, con independencia de cómo navegue o de las capacidades desde las que lo haga.",
  "Esta declaración explica qué hemos hecho hasta ahora, qué sabemos que todavía no está bien y cómo puedes decírnoslo.",
];

export const ACCESIBILIDAD_SECTIONS: LegalSection[] = [
  {
    number: "1",
    title: "Declaración de accesibilidad",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Esta declaración se aplica al sitio web cameliainteriorismo.com, propiedad de Camelia Interiorismo.",
          "Trabajamos para que la web sea utilizable por el mayor número de personas posible, incluidas quienes navegan solo con el teclado, quienes usan un lector de pantalla, quienes amplían el texto o quienes prefieren reducir el movimiento en pantalla.",
          "La accesibilidad no es una casilla que se marca una vez. Es parte de cómo mantenemos la web, igual que el resto del diseño.",
        ],
      },
    ],
  },
  {
    number: "2",
    title: "Nuestro compromiso",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Aplicamos buenas prácticas de accesibilidad desde el diseño, no como un añadido posterior: las decisiones de tipografía, color, jerarquía y espacio se toman pensando también en la legibilidad, y el desarrollo sigue el marcado semántico que corresponde a cada contenido.",
          "Tomamos como referencia las Pautas de Accesibilidad para el Contenido Web (WCAG) en su nivel AA. Aún no hemos realizado una auditoría externa, por lo que no declaramos un nivel de conformidad: preferimos contarte con precisión qué hemos comprobado y qué no.",
        ],
      },
    ],
  },
  {
    number: "3",
    title: "Medidas adoptadas",
    blocks: [
      {
        type: "text",
        paragraphs: ["Hasta la fecha hemos trabajado en lo siguiente:"],
      },
      {
        type: "list",
        items: [
          "Tipografía legible, con cuerpos e interlineados amplios y anchos de línea limitados en los textos largos para facilitar la lectura.",
          "Contraste alto en el texto principal, por encima del mínimo recomendado.",
          "Navegación clara y coherente: misma estructura en todas las páginas, con el menú y el pie siempre en el mismo lugar.",
          "Manejo completo con teclado en el menú, los formularios y el panel de configuración de cookies, con foco visible y sin bloqueos.",
          "Estructura semántica correcta: un único encabezado principal por página y jerarquía ordenada de títulos, listas y formularios con sus etiquetas asociadas.",
          "Textos alternativos en las imágenes que aportan información y ocultación de las imágenes decorativas para lectores de pantalla.",
          "Diseño responsive, utilizable desde móvil, tablet y escritorio sin necesidad de desplazamiento horizontal.",
          "Respeto por la preferencia de movimiento reducido del sistema en el menú, transiciones entre páginas, pasos del formulario y elementos animados.",
        ],
      },
    ],
  },
  {
    number: "4",
    title: "Limitaciones conocidas",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Somos conscientes de que la web todavía tiene puntos que mejorar:",
        ],
      },
      {
        type: "list",
        items: [
          "Algunos textos secundarios y textos de ejemplo en campos de formulario presentan un contraste inferior al recomendado. Estamos revisándolos.",
          "La preferencia de movimiento reducido aún no se aplica a todos los elementos animados.",
          "Los contenidos de terceros, como el mapa en la página de Contacto, no están bajo nuestro control directo y pueden no cumplir los mismos criterios.",
          "Aún no se ha realizado una revisión con usuarios reales ni una auditoría independiente.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Iremos corrigiendo estos puntos y actualizando esta página a medida que avancemos.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Contacto y sugerencias",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Si encuentras una barrera al usar esta web, cuéntanoslo. Nos ayuda más de lo que parece: casi siempre es la forma más rápida de detectar algo que no habíamos visto.",
          "Escríbenos indicando, si puedes, en qué página ocurre y qué has intentado hacer. Te responderemos y te diremos cómo pensamos resolverlo.",
        ],
      },
      {
        type: "details",
        entries: [
          {
            label: "Correo electrónico",
            value: "info@cameliainteriorismo.com",
            href: "mailto:info@cameliainteriorismo.com",
          },
          {
            label: "Web",
            value: "cameliainteriorismo.com",
            href: "https://cameliainteriorismo.com",
          },
        ],
      },
    ],
  },
];
