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
import { conNombre, resolver, type Plantilla } from "@/lib/email/textos";

export type SolicitudProyecto = {
  reference: string;
  fecha: string;
  answers: Record<string, string>;
};

/**
 * Qué respuestas se enseñan y en qué orden, según la referencia.
 *
 * La lista es cerrada a propósito: el formulario recoge más campos de los que
 * salen aquí —`razonPrincipal` y `objetivos`, por ejemplo— y el diseño no los
 * incluye. Añadir un paso al formulario no cambia estos correos por su
 * cuenta; hay que decidirlo y sumarlo a estas listas.
 */
const RESUMEN_CLIENTE = [
  "direccion",
  "tipoProyecto",
  "superficie",
  "inversion",
  "formaTrabajo",
  "cuandoEmpezar",
  "canalContacto",
] as const;

const ESTUDIO_CONTACTO = [
  "nombre",
  "telefono",
  "email",
  "canalContacto",
  "cuandoEmpezar",
] as const;

const ESTUDIO_PROYECTO = [
  "direccion",
  "tipoProyecto",
  "superficie",
  "inversion",
  "formaTrabajo",
  "referencias",
  "comoNosConociste",
] as const;

/**
 * La superficie se pregunta como número y se lee como medida, así que la
 * unidad se pone al pintarla: el dato guardado no cambia.
 *
 * Solo se añade si no viene ya puesta —alguien puede escribir "120 m2" en el
 * formulario—, para no acabar con un "120 m² m²".
 */
function conUnidad(clave: string, valor?: string): string | undefined {
  if (clave !== "superficie") return valor;
  const limpio = valor?.trim();
  if (!limpio) return valor;
  return /m\s*(²|2|\u33A1)\s*$/i.test(limpio) ? limpio : `${limpio} m²`;
}

function filasDe(
  answers: Record<string, string>,
  claves: readonly string[],
  rotulo: (k: string) => string,
): string {
  return claves.map((k) => fila(rotulo(k), conUnidad(k, answers[k]))).join("");
}

function textoDe(
  answers: Record<string, string>,
  claves: readonly string[],
  rotulo: (k: string) => string,
): [string, string | undefined][] {
  return claves.map((k) => [rotulo(k), conUnidad(k, answers[k])]);
}

/** Confirmación para quien ha contado su proyecto. */
export function emailCliente(
  s: SolicitudProyecto,
  contacto: Contacto,
  textos?: Plantilla,
) {
  const t = resolver("proyectoCliente", textos);
  const nombre = s.answers.nombre?.trim();

  const cuerpo = `
    ${t.intro.map((p) => parrafo(esc(conNombre(p, nombre)))).join("")}
    ${titulo(t.seccion(0))}
    ${tabla(filasDe(s.answers, RESUMEN_CLIENTE, t.rotulo))}
    <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
    ${parrafo(esc(t.outro))}
  `;

  return {
    subject: t.subject,
    html: envoltorio({
      preheader: t.intro[1] ?? t.title,
      titular: t.title,
      referenciaLabel: t.referenceLabel,
      referencia: s.reference,
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      t.title,
      t.referenceLabel,
      s.reference,
      [
        ...t.intro.map((p) => conNombre(p, nombre)),
        t.seccion(0),
        ...textoDe(s.answers, RESUMEN_CLIENTE, t.rotulo),
        t.outro,
      ],
      contacto,
    ),
  };
}

/** Aviso para el estudio. */
export function emailEstudio(
  s: SolicitudProyecto,
  contacto: Contacto,
  textos?: Plantilla,
) {
  const t = resolver("proyectoEstudio", textos);
  const nombre = s.answers.nombre?.trim() || "Sin nombre";

  const cuerpo = `
    ${titulo(t.seccion(0))}
    ${tabla(filasDe(s.answers, ESTUDIO_CONTACTO, t.rotulo))}
    ${titulo(t.seccion(1))}
    ${tabla(filasDe(s.answers, ESTUDIO_PROYECTO, t.rotulo))}
    ${titulo(t.seccion(2))}
    ${tabla(fila(t.rotulo("fecha"), s.fecha))}
  `;

  return {
    subject: `${t.subject} · ${s.reference}`,
    html: envoltorio({
      preheader: `${nombre} ha enviado una solicitud de proyecto.`,
      titular: t.title,
      referenciaLabel: t.referenceLabel,
      referencia: s.reference,
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      t.title,
      t.referenceLabel,
      s.reference,
      [
        t.seccion(0),
        ...textoDe(s.answers, ESTUDIO_CONTACTO, t.rotulo),
        t.seccion(1),
        ...textoDe(s.answers, ESTUDIO_PROYECTO, t.rotulo),
        t.seccion(2),
        [t.rotulo("fecha"), s.fecha],
      ],
      contacto,
    ),
  };
}
