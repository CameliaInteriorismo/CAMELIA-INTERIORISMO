/**
 * Política de Privacidad, transcribed verbatim from the text the studio
 * supplied.
 *
 * Same rule as the Aviso Legal (see aviso-legal.ts): legal copy is quoted,
 * not edited — nothing reworded, shortened or reordered. The closing
 * editorial note that came with the source ("Creo que esta versión está muy
 * por encima de la plantilla original…") is left out because it comments on
 * the document rather than forming part of it.
 *
 * Two things worth flagging rather than quietly fixing:
 *
 * - Teléfono y dirección ya coinciden con el Aviso Legal, el footer y
 *   Contacto. El teléfono es el mismo número con distinta agrupación
 *   (601 531 301). La dirección va en la forma legal de una línea, con
 *   planta; el footer y Contacto la rotulan en tres líneas y los enlaces a
 *   Maps la usan sin planta (ver CONTACT en features/contacto/data.ts).
 * - Section 10 names Google Places as the address autocomplete. The form
 *   currently runs on Photon and only switches to Google when a key is set
 *   (see src/lib/address/providers.ts), so this clause describes the
 *   intended provider, not today's.
 */

import type { LegalSection } from "@/features/legal/types";

export const PRIVACIDAD_SECTIONS: LegalSection[] = [
  {
    number: "1",
    title: "Introducción",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "En CAMELIA nos comprometemos a proteger la privacidad de las personas que visitan nuestro sitio web y utilizan nuestros servicios.",
          "La presente Política de Privacidad explica cómo recopilamos, utilizamos, conservamos y protegemos los datos personales facilitados por los usuarios a través de nuestro sitio web, de conformidad con el Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) y la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
          "El uso de este sitio web implica la aceptación de la presente Política de Privacidad.",
        ],
      },
    ],
  },
  {
    number: "2",
    title: "Responsable del tratamiento",
    blocks: [
      {
        type: "details",
        entries: [
          { label: "Nombre comercial", value: "CAMELIA" },
          { label: "Titular", value: "Laura Castillo Valverde" },
          { label: "NIF", value: "20850524N" },
          {
            label: "Dirección",
            value: "Av. Hispanitat, 4, Entresuelo 1, 46600, Alzira (Valencia)",
          },
          {
            label: "Teléfono",
            value: "601 531 301",
            href: "tel:+34601531301",
          },
          {
            label: "Correo electrónico",
            value: "info@cameliainteriorismo.com",
            href: "mailto:info@cameliainteriorismo.com",
          },
          {
            label: "Sitio web",
            value: "cameliainteriorismo.com",
            href: "https://cameliainteriorismo.com",
          },
        ],
      },
    ],
  },
  {
    number: "3",
    title: "¿Qué datos personales recopilamos?",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "CAMELIA únicamente recopila los datos que el usuario facilita voluntariamente mediante los formularios disponibles en la web.",
          "Actualmente, el principal formulario es «Cuéntanos tu proyecto», mediante el cual podremos solicitar, entre otros, los siguientes datos:",
        ],
      },
      {
        type: "list",
        items: [
          "Nombre y apellidos.",
          "Correo electrónico.",
          "Teléfono.",
          "Dirección del proyecto.",
          "Tipo de proyecto.",
          "Superficie aproximada.",
          "Inversión estimada.",
          "Forma de trabajar.",
          "Fecha estimada de inicio.",
          "Preferencia de contacto.",
          "Cómo nos has conocido.",
          "Información adicional facilitada por el usuario.",
          "Fotografías, documentos o archivos que el usuario decida adjuntar.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Asimismo, cuando el usuario realiza una solicitud de piezas desde la sección Shop, podremos tratar los datos necesarios para gestionar dicha solicitud.",
        ],
      },
    ],
  },
  {
    number: "4",
    title: "Finalidad del tratamiento",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Los datos personales serán tratados con las siguientes finalidades:",
        ],
      },
      {
        type: "list",
        items: [
          "Gestionar las solicitudes de proyectos recibidas.",
          "Contactar con el usuario para ampliar información sobre su proyecto.",
          "Elaborar propuestas o presupuestos cuando proceda.",
          "Gestionar las solicitudes de piezas realizadas desde la tienda.",
          "Comprobar disponibilidad de productos antes de formalizar cualquier pedido.",
          "Atender consultas realizadas por correo electrónico o teléfono.",
          "Mejorar la calidad de nuestros servicios.",
          "Cumplir las obligaciones legales que resulten de aplicación.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "CAMELIA no elabora perfiles automatizados ni adopta decisiones automatizadas que produzcan efectos jurídicos sobre los usuarios.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Solicitudes de piezas (Shop)",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "La sección Shop de CAMELIA no constituye una tienda online con pago directo.",
          "Las solicitudes realizadas por los usuarios tienen únicamente carácter informativo y permiten:",
        ],
      },
      {
        type: "list",
        items: [
          "comprobar la disponibilidad de las piezas;",
          "preparar una propuesta personalizada;",
          "contactar posteriormente con el usuario para continuar el proceso de compra.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "La solicitud enviada no implica la formalización de un contrato de compraventa ni la realización de ningún pago online.",
        ],
      },
    ],
  },
  {
    number: "6",
    title: "Legitimación para el tratamiento",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "La base jurídica que legitima el tratamiento de los datos será, según cada caso:",
        ],
      },
      {
        type: "list",
        items: [
          "El consentimiento prestado por el usuario al completar los formularios.",
          "La aplicación de medidas precontractuales solicitadas por el interesado.",
          "La ejecución de una relación contractual cuando resulte aplicable.",
          "El cumplimiento de obligaciones legales.",
          "El interés legítimo de CAMELIA para atender solicitudes y mejorar sus servicios.",
        ],
      },
    ],
  },
  {
    number: "7",
    title: "Conservación de los datos",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir la finalidad para la que fueron recabados.",
          "Posteriormente permanecerán debidamente bloqueados durante los plazos legalmente establecidos para atender posibles responsabilidades legales.",
        ],
      },
    ],
  },
  {
    number: "8",
    title: "Destinatarios de los datos",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Con carácter general, CAMELIA no cederá datos personales a terceros.",
          "Únicamente podrán comunicarse cuando exista una obligación legal o cuando resulte imprescindible para la correcta prestación del servicio.",
          "Asimismo, determinados proveedores tecnológicos podrán acceder a los datos en calidad de encargados del tratamiento, entre ellos aquellos relacionados con:",
        ],
      },
      {
        type: "list",
        items: [
          "alojamiento web;",
          "correo electrónico;",
          "analítica web;",
          "servicios de mapas y autocompletado de direcciones;",
          "plataformas de gestión necesarias para el funcionamiento del sitio web.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Todos ellos actuarán conforme a los contratos de tratamiento exigidos por la normativa vigente.",
        ],
      },
    ],
  },
  {
    number: "9",
    title: "Transferencias internacionales",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Algunos de los proveedores tecnológicos utilizados por CAMELIA pueden encontrarse fuera del Espacio Económico Europeo.",
          "Cuando esto ocurra, dichas transferencias se realizarán únicamente con proveedores que ofrezcan garantías adecuadas conforme al Reglamento General de Protección de Datos.",
        ],
      },
    ],
  },
  {
    number: "10",
    title: "Google Places",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "El formulario de proyectos incorpora un sistema de autocompletado de direcciones mediante Google Places.",
          "Al utilizar esta funcionalidad, determinadas consultas relacionadas con direcciones podrán ser tratadas por Google conforme a su propia Política de Privacidad.",
          "CAMELIA no utiliza dicha información para finalidades distintas a facilitar la introducción correcta de la dirección del proyecto.",
        ],
      },
    ],
  },
  {
    number: "11",
    title: "Google Analytics y herramientas de medición",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Este sitio web utiliza herramientas de analítica para conocer de forma agregada el comportamiento de los usuarios y mejorar continuamente la experiencia de navegación.",
          "La información obtenida tiene carácter estadístico y no permite identificar personalmente a los usuarios.",
          "Estas herramientas se activarán únicamente conforme al consentimiento otorgado a través del sistema de gestión de cookies.",
        ],
      },
    ],
  },
  {
    number: "12",
    title: "Redes sociales",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "CAMELIA mantiene perfiles oficiales en distintas redes sociales.",
          "Actualmente:",
        ],
      },
      { type: "list", items: ["Instagram", "TikTok"] },
      {
        type: "text",
        paragraphs: [
          "La interacción con dichos perfiles se regirá por las políticas de privacidad de cada plataforma.",
        ],
      },
    ],
  },
  {
    number: "13",
    title: "Comunicaciones comerciales",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "CAMELIA no enviará comunicaciones comerciales por medios electrónicos salvo que el usuario las haya solicitado expresamente o exista una relación previa que lo permita conforme a la legislación vigente.",
          "En cualquier momento el usuario podrá solicitar dejar de recibir dichas comunicaciones.",
        ],
      },
    ],
  },
  {
    number: "14",
    title: "Seguridad",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "CAMELIA aplica las medidas técnicas y organizativas necesarias para proteger los datos personales frente a accesos no autorizados, pérdidas, alteraciones o tratamientos ilícitos, atendiendo al estado de la tecnología y a la naturaleza de los datos tratados.",
          "No obstante, el usuario debe ser consciente de que ningún sistema de seguridad en Internet puede garantizar una protección absoluta.",
        ],
      },
    ],
  },
  {
    number: "15",
    title: "Derechos del usuario",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "El usuario podrá ejercer en cualquier momento los siguientes derechos:",
        ],
      },
      {
        type: "list",
        items: [
          "Acceso.",
          "Rectificación.",
          "Supresión.",
          "Oposición.",
          "Limitación del tratamiento.",
          "Portabilidad.",
          "Retirada del consentimiento cuando proceda.",
        ],
      },
      { type: "text", paragraphs: ["Para ello podrá dirigirse a:"] },
      {
        type: "lines",
        items: [
          {
            value: "info@cameliainteriorismo.com",
            href: "mailto:info@cameliainteriorismo.com",
          },
        ],
      },
      { type: "text", paragraphs: ["o por correo postal a:"] },
      {
        type: "lines",
        items: [
          // Dirección postal para ejercer derechos: la misma forma legal de
          // una línea que el bloque de identificación de arriba.
          {
            value: "Av. Hispanitat, 4, Entresuelo 1, 46600, Alzira (Valencia)",
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "En caso de duda sobre la identidad del solicitante, podrá requerirse documentación acreditativa.",
        ],
      },
    ],
  },
  {
    number: "16",
    title: "Reclamaciones",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Si el usuario considera que el tratamiento de sus datos personales no se ajusta a la normativa vigente, podrá presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).",
          "Más información en:",
        ],
      },
      {
        type: "lines",
        items: [{ value: "https://www.aepd.es", href: "https://www.aepd.es" }],
      },
    ],
  },
  {
    number: "17",
    title: "Modificaciones de la política",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "CAMELIA podrá modificar la presente Política de Privacidad para adaptarla a cambios legislativos, técnicos o de funcionamiento del sitio web.",
          "La versión publicada en cada momento será la vigente.",
        ],
      },
    ],
  },
];
