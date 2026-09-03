import "server-only";

/**
 * Los textos fijos de los cuatro correos.
 *
 * Lo que hay aquí escrito es exactamente lo de la referencia, y hace de
 * respaldo: si el campo correspondiente de Sanity está vacío —o si el
 * documento todavía no existe— el correo sale igual. Así el panel puede
 * quedarse a medias sin que nadie reciba un correo con huecos.
 *
 * Ni un dato del formulario entra en este fichero. Lo de aquí son rótulos;
 * los valores llegan de la solicitud.
 */

export type Plantilla = {
  subject?: string;
  title?: string;
  intro?: string[];
  sections?: string[];
  labels?: { key?: string; label?: string }[];
  outro?: string;
};

export type TextosCorreo = {
  productoCliente?: Plantilla;
  productoEstudio?: Plantilla;
  proyectoCliente?: Plantilla;
  proyectoEstudio?: Plantilla;
};

type Defecto = {
  subject: string;
  title: string;
  intro: string[];
  sections: string[];
  labels: Record<string, string>;
  outro: string;
};

export const POR_DEFECTO = {
  productoCliente: {
    subject: "Solicitud recibida · Camelia Interiorismo",
    title: "Solicitud recibida",
    intro: [
      "Hola {nombre}, gracias por escribirnos.",
      "Hemos recibido tu solicitud y la estamos revisando. Te contactaremos en breve para confirmarte disponibilidad y plazos.",
    ],
    sections: ["LO QUE HAS SOLICITADO", "CÓMO LO RECIBIRÁS"],
    labels: { entrega: "Entrega", direccion: "Dirección" },
    outro: "Si necesitas cambiar algo, respóndenos a este mismo correo.",
  },
  productoEstudio: {
    subject: "Nueva solicitud de artículo",
    title: "Nueva solicitud de artículo",
    intro: [],
    sections: ["CLIENTE", "ARTÍCULOS", "ENTREGA", "SOLICITUD"],
    labels: {
      nombre: "Nombre",
      dni: "DNI/NIF",
      email: "Email",
      telefono: "Teléfono",
      modo: "Modo",
      direccion: "Dirección",
      codigoPostal: "Código postal",
      localidad: "Localidad",
      provincia: "Provincia",
      fecha: "Fecha y hora",
    },
    outro: "",
  },
  proyectoCliente: {
    subject: "Solicitud de proyecto recibida · Camelia Interiorismo",
    title: "Solicitud de proyecto recibida",
    intro: [
      "Hola {nombre}, gracias por contarnos tu proyecto.",
      "Lo estamos revisando con calma. Nos pondremos en contacto contigo en un plazo de 24 horas para conocernos y hablarlo con más detalle.",
    ],
    sections: ["LO QUE NOS HAS CONTADO"],
    labels: {
      direccion: "Dirección del proyecto",
      tipoProyecto: "Tipo de proyecto",
      superficie: "Superficie aproximada",
      inversion: "Inversión estimada",
      formaTrabajo: "Forma de trabajar",
      cuandoEmpezar: "Le gustaría empezar",
      canalContacto: "Prefiere que le contactemos por",
    },
    outro: "Si quieres añadir o corregir algo, respóndenos a este mismo correo.",
  },
  proyectoEstudio: {
    subject: "Nueva solicitud de proyecto",
    title: "Nueva solicitud de proyecto",
    intro: [],
    sections: ["CONTACTO", "EL PROYECTO", "SOLICITUD"],
    labels: {
      nombre: "Nombre",
      telefono: "Teléfono",
      email: "Email",
      canalContacto: "Prefiere que le contactemos por",
      cuandoEmpezar: "Le gustaría empezar",
      direccion: "Dirección del proyecto",
      tipoProyecto: "Tipo de proyecto",
      superficie: "Superficie aproximada",
      inversion: "Inversión estimada",
      formaTrabajo: "Forma de trabajar",
      referencias: "Referencias",
      comoNosConociste: "Nos ha conocido por",
      fecha: "Fecha y hora",
    },
    outro: "",
  },
} as const satisfies Record<string, Defecto>;

export type Clave = keyof typeof POR_DEFECTO;

/** Lo que la plantilla usa: siempre relleno, venga de Sanity o del respaldo. */
export type Resuelto = {
  subject: string;
  title: string;
  intro: string[];
  seccion: (indice: number) => string;
  rotulo: (clave: string) => string;
  outro: string;
};

/** Una cadena del panel solo gana si trae algo escrito. */
const usar = (valor: string | undefined, defecto: string) =>
  valor && valor.trim() ? valor.trim() : defecto;

/**
 * Mezcla lo del panel con lo de aquí, campo a campo.
 *
 * Se resuelve por posición en las secciones y por clave en los rótulos: así
 * quien edita puede dejar en blanco lo que no quiera cambiar sin que el resto
 * se descoloque.
 */
export function resolver(clave: Clave, desdeSanity?: Plantilla): Resuelto {
  const d = POR_DEFECTO[clave] as Defecto;
  const s = desdeSanity ?? {};

  const intro = s.intro?.filter((p) => p && p.trim());

  return {
    subject: usar(s.subject, d.subject),
    title: usar(s.title, d.title),
    intro: intro?.length ? intro : d.intro,
    seccion: (i) => usar(s.sections?.[i], d.sections[i] ?? ""),
    rotulo: (k) =>
      usar(
        s.labels?.find((l) => l.key === k)?.label,
        d.labels[k] ?? k,
      ),
    outro: usar(s.outro, d.outro),
  };
}

/**
 * Sustituye {nombre} por quien escribe. Si no hay nombre, se lleva por
 * delante el espacio anterior para que no quede "Hola , gracias".
 */
export function conNombre(texto: string, nombre?: string): string {
  const limpio = nombre?.trim();
  return limpio
    ? texto.replace(/\{nombre\}/g, limpio)
    : texto.replace(/\s*\{nombre\}/g, "");
}
