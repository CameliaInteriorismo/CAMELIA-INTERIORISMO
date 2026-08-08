export type Step =
  | {
      kind: "intro";
      title: string[];
      paragraphs: string[];
      cta: string;
      image: string;
    }
  | {
      kind: "text";
      name: string;
      title: string;
      help?: string;
      placeholder?: string;
      inputMode?: "text" | "numeric";
      /**
       * Swaps the plain input for the address type-ahead (see
       * AddressAutocomplete + src/lib/address).
       */
      autocomplete?: "address";
      image: string;
    }
  | {
      kind: "choice";
      name: string;
      title: string;
      help?: string;
      options: string[];
      image: string;
    }
  | {
      kind: "long";
      name: string;
      title: string;
      help?: string;
      fields: { name: string; label: string; placeholder?: string }[];
      image: string;
    }
  /** Several labelled single-line inputs on one screen (the contact details). */
  | {
      kind: "fields";
      title: string;
      help?: string;
      fields: {
        name: string;
        label: string;
        placeholder?: string;
        type?: "text" | "tel" | "email";
        inputMode?: "text" | "tel" | "email";
      }[];
      image: string;
    }
  /** Two radio groups on one screen (how to talk, and when to start). */
  | {
      kind: "choiceGroups";
      title: string;
      help?: string;
      groups: { name: string; label: string; options: string[] }[];
      image: string;
    };

const DIR = "/assets/contacto";

// Transcribed from Diseño/FORMULARIO CONTACTO 1–11. (There is no screen 7
// in the folder — the files jump 6 → 8 — so the flow has ten steps, not
// eleven; flagged rather than invented.)
//
// Photography comes from the same Contacto folder. Four shots are matched to
// their screen exactly — inversion.jpg and como nos has conocido.jpg by name,
// 22 AUG 25 P.jpg and Vesta JAN 25-14.jpg by matching the flattened mockup
// against the source (0.996+ correlation, both cropped dead centre). The
// rest are assigned in the order the mockups suggest, since those references
// give nothing to match against.
export const STEPS: Step[] = [
  {
    kind: "intro",
    title: ["Hablemos de", "tu proyecto"],
    paragraphs: [
      "Cuéntanos tu idea y te ayudaremos a darle forma.",
      "Si quieres conocernos mejor, resolver alguna duda o hablar sobre tu proyecto, estaremos encantados de escucharte y acompañarte en el inicio del proceso.",
      "A través de este formulario puedes contarnos qué tienes en mente, qué necesitas y cómo imaginas tu espacio. Revisaremos tu proyecto y te contactaremos para ayudarte y darle forma.",
    ],
    cta: "COMENZAR",
    image: `${DIR}/Vesta Studio-3.jpg`,
  },
  {
    kind: "text",
    name: "direccion",
    title: "Dirección del proyecto de reforma",
    help: "Esto nos ayudará a entender mejor el contexto y las necesidades del espacio.",
    placeholder: "Ej. Calle Campanar, Valencia, España",
    autocomplete: "address",
    image: `${DIR}/Vesta JAN 25-7.jpg`,
  },
  {
    kind: "choice",
    name: "tipoProyecto",
    title: "Tengo en mente el siguiente proyecto…",
    help: "Desde pequeños cambios hasta una reforma completa, cada proyecto parte de necesidades diferentes.",
    options: [
      "Reforma integral",
      "Reforma parcial",
      "Actualización estética y decoración",
      "Redistribución del espacio",
      "Proyecto para una vivienda nueva",
      "Espacio comercial o profesional",
    ],
    image: `${DIR}/P Reels JUN 10.jpg`,
  },
  {
    kind: "text",
    name: "superficie",
    title: "Superficie aproximada del proyecto",
    help: "Compartir una estimación aproximada de los m2 de superficie para contextualizar correctamente el proyecto.",
    placeholder: "Ej. 120 m²",
    inputMode: "numeric",
    image: `${DIR}/Vesta JAN 25-3.jpg`,
  },
  {
    kind: "choice",
    name: "inversion",
    title: "Inversión estimada para el proyecto",
    help: "Selecciona la franja que mejor se ajuste a la inversión aproximada que te gustaría destinar al espacio.",
    options: [
      "De 3.000€ a 10.000€",
      "De 10.000€ a 20.000€",
      "De 20.000€ a 40.000€",
      "De 40.000€ a 60.000€",
      "De 60.000€ a 100.000€",
      "Más de 100.000€",
    ],
    image: `${DIR}/inversion.jpg`,
  },
  {
    kind: "choice",
    name: "formaTrabajo",
    title: "Forma de trabajar del proyecto",
    help: "Queremos entender cómo te gustaría vivir y participar en todo el proceso.",
    options: [
      "Prefiero delegarlo completamente",
      "Me gustaría participar de forma activa",
      "Quiero participar en todo el proceso",
    ],
    image: `${DIR}/Vesta Studio-5.jpg`,
  },
  {
    kind: "long",
    name: "detalles",
    title: "Algunos detalles más sobre el proyecto",
    help: "Esta parte es completamente opcional, pero nos ayudará a entender mejor tu estilo, tus necesidades y la visión que tienes para el espacio.",
    fields: [
      {
        name: "razonPrincipal",
        label:
          "¿Cuál es la razón principal por la que te gustaría contratar a un diseñador de interiores?",
        placeholder: "Háblanos de aquello que sientes que empieza a moverte",
      },
      {
        name: "objetivos",
        label: "¿Cuáles serían los objetivos principales del proyecto?",
        placeholder: "Queremos entender qué buscas para este proyecto",
      },
      {
        name: "referencias",
        label:
          "Si tienes un tablero de Pinterest, Instagram o cualquier referencia visual, puedes compartirla aquí.",
        placeholder: "Pega aquí el enlace",
      },
    ],
    image: `${DIR}/P Reels MoodBoard.jpg`,
  },
  {
    kind: "choice",
    name: "comoNosConociste",
    title: "¿Cómo nos has conocido?",
    help: "Nos ayuda a entender desde dónde llegan personas interesadas en nuestro trabajo.",
    options: ["Instagram", "TikTok", "Página web", "Recomendación", "Otros"],
    image: `${DIR}/como nos has conocido.jpg`,
  },
  {
    kind: "fields",
    title: "Ya casi hemos terminado",
    help: "Solo necesitamos tus datos para poder revisar la información y ponernos en contacto contigo.",
    fields: [
      {
        name: "nombre",
        label: "Nombre y apellidos",
        placeholder: "Ej. Laura Castillo",
      },
      {
        name: "telefono",
        label: "Teléfono",
        placeholder: "Ej. 601 53 1301",
        type: "tel",
        inputMode: "tel",
      },
      {
        name: "email",
        label: "Correo electrónico",
        placeholder: "Ej. info@cameliainteriorismo.com",
        type: "email",
        inputMode: "email",
      },
    ],
    image: `${DIR}/22 AUG 25 P.jpg`,
  },
  {
    kind: "choiceGroups",
    title: "¿Cómo prefieres que hablemos?",
    help: "Elige la forma que te resulte más cómoda y cuándo te gustaría comenzar el proyecto.",
    groups: [
      {
        name: "canalContacto",
        label: "¿Cómo prefieres que te contactemos?",
        // FORMULARIO CONTACTO 11 lists a fifth option, "Otro"; dropped at
        // the studio's request — the four channels here cover it.
        options: [
          "Teléfono",
          "WhatsApp",
          "Correo electrónico",
          "Sin preferencia",
        ],
      },
      {
        name: "cuandoEmpezar",
        label: "¿Cuándo te gustaría empezar?",
        options: [
          "Lo antes posible",
          "En el próximo mes",
          "En 2–3 meses",
          "En más de 3 meses",
          "Solo quiero informarme de momento",
        ],
      },
    ],
    image: `${DIR}/Vesta JAN 25-14.jpg`,
  },
];
