/**
 * Encuadre de la foto en MÓVIL, cuando hace falta apartarse del general.
 *
 * Apilada, la caja es apaisada y las fotos son verticales, así que solo cabe
 * una franja: por defecto se coge la de arriba (0). En alguna foto el motivo
 * no está arriba, y ahí ese recorte se queda con el fondo desenfocado o corta
 * lo que se quiere ver. Este campo dice qué franja coger en su lugar — un
 * porcentaje vertical (el eje X del recorte siempre va centrado), no solo
 * top/center/bottom: algún motivo pedía un punto intermedio exacto que esas
 * tres franjas fijas no daban. Solo afecta a móvil; desde `md` la caja
 * acompaña a la foto y el encuadre es el general de siempre.
 */
export type EncuadreMovil = number;

export type Step = {
  encuadreMovil?: EncuadreMovil;
  /**
   * Solo en móvil, une este paso a los de al lado que compartan el mismo
   * valor en una sola pantalla (ver `agruparPasos` en ProjectForm). En
   * desktop cada paso sigue siendo su propia pantalla — es lo que mantiene
   * corta la foto compartida (ver el comentario junto a su `min-h`) — pero
   * esa razón no existe en móvil, donde la foto ya tiene una proporción fija
   * en vez de una altura mínima compartida. Agruparlos de vuelta ahí ahorra
   * toques sin deshacer esa división.
   */
  mobileGroup?: string;
} & (
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
      /** Substring of `help` to set in bold. Matched verbatim. */
      helpBold?: string;
      fields: { name: string; label: string; placeholder?: string }[];
      image: string;
    }
  /**
   * Several labelled single-line inputs on one screen (the contact details).
   * `name` doesn't feed `answers` — each field has its own — it only gives
   * the step a stable identity for Sanity's key, same reason `text`/`choice`/
   * `long` carry one. Without it the key fell back to `fields-<índice>`,
   * which shifted (and silently stopped matching Sanity's saved content)
   * the moment another step was added earlier in the array.
   */
  | {
      kind: "fields";
      name: string;
      title: string;
      help?: string;
      fields: {
        name: string;
        label: string;
        placeholder?: string;
        type?: "text" | "tel" | "email";
        inputMode?: "text" | "tel" | "email";
        /** Shares its row with the next `half` field instead of stacking. */
        half?: boolean;
      }[];
      image: string;
    }
);

const DIR = "/assets/contacto";

// Transcribed from Diseño/FORMULARIO CONTACTO 1–11. (There is no screen 7
// in the folder — the files jump 6 → 8 — so the reference itself has ten
// steps, not eleven; flagged rather than invented.) The extra ones from here
// on are ours, not the reference's: "detalles" and the old two-group
// "¿Cómo prefieres que hablemos?" were each split into one question per
// screen to bring down the shared photo height — see the comments below.
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
    // Las sillas ganan protagonismo bajando un poco desde arriba: al 0% por
    // defecto entraba demasiado techo/pared vacíos antes de llegar a ellas.
    encuadreMovil: 20,
  },
  {
    kind: "text",
    name: "direccion",
    title: "Dirección del proyecto de reforma",
    help: "Esto nos ayudará a entender mejor el contexto y las necesidades del espacio.",
    placeholder: "Ej. Calle Campanar, Valencia, España",
    autocomplete: "address",
    image: `${DIR}/Vesta JAN 25-7.jpg`,
    // La planta está hacia el tercio inferior de la foto, no arriba: al 0%
    // por defecto solo entraban las cortinas.
    encuadreMovil: 80,
  },
  {
    kind: "choice",
    name: "tipoProyecto",
    title: "Tengo en mente el siguiente proyecto…",
    help: "Desde pequeños cambios hasta una reforma completa, cada proyecto parte de necesidades diferentes.",
    // Las manos con los azulejos están hacia la mitad inferior de la foto,
    // no arriba: arriba solo entraba el jarrón. Ver medida real en el
    // navegador, junto al resto de encuadres de este mismo cambio.
    encuadreMovil: 60,
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
    // Las dos baldas con las tazas están a media altura del mueble.
    encuadreMovil: 40,
    options: [
      "Prefiero delegarlo completamente",
      "Me gustaría participar de forma activa",
      "Quiero participar en todo el proceso",
    ],
    image: `${DIR}/Vesta Studio-5.jpg`,
  },
  // Antes era un solo paso con las tres preguntas de esta sección. Repartido
  // en tres pantallas —esta, "objetivos" y "referenciasVisuales" más abajo—
  // porque incluso ya partido en dos (razón + objetivos juntos) seguía siendo
  // el paso más alto con diferencia (613-658px según el ancho, frente a
  // 461-468px del siguiente más alto una vez separado también "¿Cómo
  // prefieres que hablemos?"). Con una pregunta por pantalla, cada una mide
  // ~400-465px y la foto compartida puede bajar de 680px — ver la cifra final
  // junto al `min-h` de la foto, más abajo en ProjectForm.
  {
    kind: "long",
    name: "detalles",
    title: "Algunos detalles más sobre el proyecto",
    help: "Esta parte es completamente opcional, pero nos ayudará a entender mejor tu estilo y tus necesidades.",
    helpBold: "Esta parte es completamente opcional",
    // Junto con "objetivos" y "referenciasVisuales" de abajo: las tres
    // vuelven a compartir pantalla en móvil, como antes del reparto.
    mobileGroup: "detalles",
    // La silla de madera asoma por debajo de la mesa de mármol, no arriba.
    // Al máximo (100) a propósito: el recorte que ya trae este fichero desde
    // Sanity (su `rect`) se queda corto por abajo — un poco más de silla que
    // esto pediría subir ese recorte en el propio Studio, no solo el
    // encuadre de aquí.
    encuadreMovil: 100,
    fields: [
      {
        name: "razonPrincipal",
        label:
          "¿Cuál es la razón principal por la que te gustaría contratar a un diseñador de interiores?",
        placeholder: "Háblanos de aquello que sientes que empieza a moverte",
      },
    ],
    image: `${DIR}/P Reels MoodBoard.jpg`,
  },
  {
    kind: "long",
    name: "objetivos",
    title: "Tus objetivos para el proyecto",
    help: "También es opcional, pero nos ayuda a entender qué buscas conseguir.",
    helpBold: "También es opcional",
    mobileGroup: "detalles",
    fields: [
      {
        name: "objetivos",
        label: "¿Cuáles serían los objetivos principales del proyecto?",
        placeholder: "Queremos entender qué buscas para este proyecto",
      },
    ],
    image: `${DIR}/P Reels MoodBoard.jpg`,
  },
  {
    kind: "long",
    name: "referenciasVisuales",
    title: "Alguna referencia visual",
    help: "También es opcional, pero nos ayuda a entender mejor la visión que tienes para el espacio.",
    helpBold: "También es opcional",
    mobileGroup: "detalles",
    // Sin `encuadreMovil` a propósito, no por olvido: en móvil este paso
    // comparte pantalla con "detalles" y "objetivos", y solo se pinta la
    // foto del PRIMERO del grupo (`primero.image` en ProjectForm) — la de
    // este paso (la planta) no llega a mostrarse hoy en ningún encuadre.
    // Ponerle un número aquí no cambiaría nada en pantalla y daría a
    // entender que está resuelto sin estarlo.
    fields: [
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
    // El rollo de tela está a media altura, no arriba: con el recorte por
    // arriba el móvil se quedaba con la silla desenfocada y la tela apenas
    // asomaba. Centrado entra el rollo entero.
    encuadreMovil: 50,
  },
  {
    kind: "fields",
    name: "contacto",
    title: "Ya casi hemos terminado",
    help: "Solo necesitamos tus datos para poder revisar la información y ponernos en contacto contigo.",
    fields: [
      // Nombre y teléfono comparten fila desde `md`: son los dos campos
      // cortos, y emparejarlos es lo que baja este paso de 533-566px a
      // ~445-467px sin quitar ninguno. Correo se queda a ancho completo
      // debajo — emparejarlo también habría exigido partir el campo más
      // ancho de los tres en dos columnas estrechas.
      {
        name: "nombre",
        label: "Nombre y apellidos",
        placeholder: "Ej. Laura Castillo",
        half: true,
      },
      {
        name: "telefono",
        label: "Teléfono",
        placeholder: "Ej. 601 53 1301",
        type: "tel",
        inputMode: "tel",
        half: true,
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
  // Antes un solo paso con dos grupos de radios ("¿Cómo prefieres que
  // hablemos?"), y el más alto del formulario con diferencia (635-647px).
  // Partido en dos pasos "choice" normales, cada uno mide 420-452px — ver el
  // comentario junto a "detalles" más arriba, mismo razonamiento. Comparten
  // `mobileGroup` para volver a aparecer juntos en móvil.
  {
    kind: "choice",
    name: "canalContacto",
    title: "¿Cómo prefieres que te contactemos?",
    help: "Elige la forma que te resulte más cómoda.",
    mobileGroup: "comoHablamos",
    // FORMULARIO CONTACTO 11 lists a fifth option, "Otro"; dropped at the
    // studio's request — the four channels here cover it.
    options: ["Teléfono", "WhatsApp", "Correo electrónico", "Sin preferencia"],
    image: `${DIR}/Vesta JAN 25-14.jpg`,
  },
  {
    kind: "choice",
    name: "cuandoEmpezar",
    title: "¿Cuándo te gustaría empezar?",
    help: "Cuéntanos cuándo te gustaría comenzar el proyecto.",
    mobileGroup: "comoHablamos",
    options: [
      "Lo antes posible",
      "En el próximo mes",
      "En 2–3 meses",
      "En más de 3 meses",
      "Solo quiero informarme de momento",
    ],
    image: `${DIR}/Vesta JAN 25-14.jpg`,
  },
];
