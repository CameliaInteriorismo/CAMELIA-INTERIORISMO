/**
 * Política de Cookies, transcribed verbatim from the text the studio
 * supplied — same rule as the other two legal documents: quoted, never
 * reworded or reordered.
 *
 * It names only what this site actually loads: Google Analytics, Meta Pixel,
 * and Google Maps/Places on Contacto. Nothing about WordPress, plugins or
 * any tooling Camelia doesn't use.
 *
 * Worth flagging: sections 3 and 5 describe a consent banner ("Aceptar
 * todas", "Rechazar", "Configurar tus preferencias") and a settings entry
 * point that don't exist in the site yet — none of these trackers is wired
 * up. The text is published as written because it describes the intended
 * setup, but the banner has to ship before Analytics or the Pixel do.
 */

import type { LegalSection } from "@/features/legal/types";

/** Opens on a sentence, not a heading — the numbered clauses start after. */
export const COOKIES_LEAD = [
  "En este sitio web, cameliainteriorismo.com, utilizamos cookies y tecnologías similares para garantizar el correcto funcionamiento de la página, mejorar la experiencia del usuario y analizar el uso del sitio web.",
  "Al navegar por esta web, aceptas el uso de cookies en las condiciones establecidas en la presente Política de Cookies.",
];

export const COOKIES_SECTIONS: LegalSection[] = [
  {
    number: "1",
    title: "¿Qué son las cookies?",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, móvil o tablet) cuando visitas una página web. Su finalidad es reconocer al usuario, guardar sus preferencias y recopilar información sobre su navegación.",
        ],
      },
    ],
  },
  {
    number: "2",
    title: "Tipos de cookies utilizadas",
    blocks: [
      {
        type: "subsection",
        title: "Cookies técnicas (necesarias)",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Son aquellas imprescindibles para el funcionamiento de la web. Permiten la navegación y el uso de las diferentes opciones o servicios, como el acceso a áreas seguras o la gestión del consentimiento de cookies.",
              "Estas cookies no requieren el consentimiento del usuario.",
            ],
          },
        ],
      },
      {
        type: "subsection",
        title: "Cookies de análisis",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Utilizamos cookies de análisis para entender cómo interactúan los usuarios con la web y mejorar nuestros servicios.",
              "En concreto, utilizamos:",
            ],
          },
          {
            type: "list",
            items: [
              "Google Analytics: nos permite medir y analizar el tráfico de la web de forma anónima.",
            ],
          },
          {
            type: "text",
            paragraphs: [
              "Estas cookies solo se activan si el usuario las acepta.",
            ],
          },
        ],
      },
      {
        type: "subsection",
        title: "Cookies de marketing",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Estas cookies permiten gestionar espacios publicitarios y analizar el comportamiento del usuario para mostrarle publicidad personalizada.",
              "En este sitio web utilizamos:",
            ],
          },
          {
            type: "list",
            items: [
              "Meta Pixel (Facebook/Instagram Ads): para medir la eficacia de nuestras campañas publicitarias y mostrar anuncios relevantes.",
            ],
          },
          {
            type: "text",
            paragraphs: [
              "Estas cookies requieren el consentimiento del usuario.",
            ],
          },
        ],
      },
      {
        type: "subsection",
        title: "Cookies de servicios externos",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Algunas funcionalidades de la web pueden utilizar servicios de terceros.",
            ],
          },
          {
            type: "list",
            items: [
              "Google Maps / Google Places: para mostrar la ubicación del estudio en la página de contacto.",
            ],
          },
          {
            type: "text",
            paragraphs: [
              "Estos servicios pueden instalar cookies en el dispositivo del usuario.",
            ],
          },
        ],
      },
    ],
  },
  {
    number: "3",
    title: "Gestión del consentimiento",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Cuando accedes por primera vez a la web, se muestra un banner de cookies donde puedes:",
        ],
      },
      {
        type: "list",
        items: [
          "Aceptar todas las cookies",
          "Rechazar las cookies no necesarias",
          "Configurar tus preferencias",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Puedes modificar tu consentimiento en cualquier momento desde la configuración de cookies disponible en la web.",
        ],
      },
    ],
  },
  {
    number: "4",
    title: "Desactivación o eliminación de cookies",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Puedes permitir, bloquear o eliminar las cookies instaladas en tu dispositivo mediante la configuración de tu navegador.",
          "Ten en cuenta que, si desactivas algunas cookies, es posible que la web no funcione correctamente.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Derechos del usuario",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Puedes obtener más información sobre el tratamiento de tus datos personales y el ejercicio de tus derechos en nuestra Política de Privacidad.",
        ],
        links: [
          {
            text: "Política de Privacidad",
            href: "/politica-de-privacidad",
          },
        ],
      },
    ],
  },
  {
    number: "6",
    title: "Actualizaciones",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Esta Política de Cookies puede modificarse en función de exigencias legales o con el fin de adaptarla a cambios en el sitio web.",
        ],
      },
    ],
  },
  {
    number: "7",
    title: "Datos de contacto",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Para cualquier duda sobre esta Política de Cookies, puedes contactar en:",
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
            value: "https://cameliainteriorismo.com",
            href: "https://cameliainteriorismo.com",
          },
        ],
      },
    ],
  },
];
