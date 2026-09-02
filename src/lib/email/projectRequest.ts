import "server-only";
import {
  envoltorio,
  esc,
  fila,
  parrafo,
  tabla,
  textoPlano,
  titulo,
  type Contacto,
} from "@/lib/email/layout";

/**
 * Las respuestas del formulario, con su rótulo y en el orden en que se
 * preguntan. La clave es la misma que usa `data.ts` para guardar la
 * respuesta, así que si algún día se añade un paso basta con sumarlo aquí.
 */
export const CAMPOS_PROYECTO = [
  ["nombre", "Nombre"],
  ["telefono", "Teléfono"],
  ["email", "Email"],
  ["canalContacto", "Prefiere que le contactemos por"],
  ["cuandoEmpezar", "Le gustaría empezar"],
  ["direccion", "Dirección del proyecto"],
  ["tipoProyecto", "Tipo de proyecto"],
  ["superficie", "Superficie aproximada"],
  ["inversion", "Inversión estimada"],
  ["formaTrabajo", "Forma de trabajar"],
  ["razonPrincipal", "Razón principal"],
  ["objetivos", "Objetivos"],
  ["referencias", "Referencias"],
  ["comoNosConociste", "Nos ha conocido por"],
] as const;

export type SolicitudProyecto = {
  fecha: string;
  answers: Record<string, string>;
};

/** El resumen que ve el cliente: sus datos, sin los rótulos internos. */
const RESUMEN_CLIENTE = [
  "tipoProyecto",
  "superficie",
  "inversion",
  "formaTrabajo",
  "cuandoEmpezar",
  "canalContacto",
] as const;

function filasDe(
  answers: Record<string, string>,
  claves: readonly string[],
): string {
  return claves
    .map((clave) => {
      const label = CAMPOS_PROYECTO.find(([k]) => k === clave)?.[1] ?? clave;
      return fila(label, answers[clave]);
    })
    .join("");
}

/** Confirmación para quien ha contado su proyecto. */
export function emailCliente(s: SolicitudProyecto, contacto: Contacto) {
  const nombre = s.answers.nombre?.trim();
  const subject = "Hemos recibido tu proyecto · Camelia Interiorismo";
  const cuerpo = `
    ${parrafo(`Hola${nombre ? ` ${esc(nombre)}` : ""}, gracias por contarnos tu proyecto.`)}
    ${parrafo("Lo estamos revisando con calma. Nos pondremos en contacto contigo en un plazo de 24 horas para conocernos y hablarlo con más detalle.")}
    ${titulo("Lo que nos has contado")}
    ${tabla(filasDe(s.answers, RESUMEN_CLIENTE))}
    ${parrafo("Si quieres añadir o corregir algo, respóndenos a este mismo correo.")}
  `;

  return {
    subject,
    html: envoltorio({
      preheader: "Hemos recibido tu proyecto y lo estamos revisando.",
      encabezado: "Solicitud de proyecto recibida",
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      "Solicitud de proyecto recibida",
      [
        `Hola${nombre ? ` ${nombre}` : ""}, gracias por contarnos tu proyecto.`,
        "Lo estamos revisando con calma. Nos pondremos en contacto contigo en un plazo de 24 horas para conocernos y hablarlo con más detalle.",
        "LO QUE NOS HAS CONTADO",
        ...RESUMEN_CLIENTE.map(
          (k) =>
            [
              CAMPOS_PROYECTO.find(([c]) => c === k)?.[1] ?? k,
              s.answers[k],
            ] as [string, string | undefined],
        ),
        "Si quieres añadir o corregir algo, respóndenos a este mismo correo.",
      ],
      contacto,
    ),
  };
}

/** Aviso para el estudio, con TODAS las respuestas del formulario. */
export function emailEstudio(s: SolicitudProyecto, contacto: Contacto) {
  const nombre = s.answers.nombre?.trim() || "Sin nombre";
  const subject = `Nueva solicitud de proyecto · ${nombre}`;

  // Cualquier respuesta que no esté en la lista de arriba se pinta igual, con
  // su clave por rótulo: si mañana se añade un paso al formulario y nadie
  // toca este fichero, el dato sigue llegando en vez de perderse en silencio.
  const conocidas = new Set<string>(CAMPOS_PROYECTO.map(([k]) => k));
  const extra = Object.keys(s.answers).filter((k) => !conocidas.has(k));

  const cuerpo = `
    ${titulo("Contacto")}
    ${tabla(filasDe(s.answers, ["nombre", "telefono", "email", "canalContacto", "cuandoEmpezar"]))}
    ${titulo("El proyecto")}
    ${tabla(
      filasDe(s.answers, [
        "direccion",
        "tipoProyecto",
        "superficie",
        "inversion",
        "formaTrabajo",
        "razonPrincipal",
        "objetivos",
        "referencias",
        "comoNosConociste",
      ]),
    )}
    ${extra.length ? titulo("Otros campos") + tabla(extra.map((k) => fila(k, s.answers[k])).join("")) : ""}
    ${titulo("Solicitud")}
    ${tabla(fila("Fecha y hora", s.fecha))}
  `;

  return {
    subject,
    html: envoltorio({
      preheader: `${nombre} ha enviado una solicitud de proyecto.`,
      encabezado: "Nueva solicitud de proyecto",
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      "Nueva solicitud de proyecto",
      [
        ...CAMPOS_PROYECTO.map(
          ([k, label]) => [label, s.answers[k]] as [string, string | undefined],
        ),
        ...extra.map((k) => [k, s.answers[k]] as [string, string | undefined]),
        "SOLICITUD",
        ["Fecha y hora", s.fecha],
      ],
      contacto,
    ),
  };
}
