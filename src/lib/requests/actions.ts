"use server";

import { z } from "zod";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import {
  assertEmailConfig,
  sendEmail,
  studioAddress,
} from "@/lib/email/resend";
import type { Contacto } from "@/lib/email/layout";
import * as producto from "@/lib/email/productRequest";
import * as proyecto from "@/lib/email/projectRequest";

/**
 * Las dos acciones que envían los correos de los formularios.
 *
 * Se valida aquí OTRA VEZ, aunque el formulario ya valide en el navegador.
 * Una acción de servidor es un endpoint POST como cualquier otro: se puede
 * llamar directamente, sin pasar por la interfaz, así que lo que llega no es
 * de fiar. La validación del navegador es comodidad para quien rellena; esta
 * es la que protege.
 */

export type ResultadoEnvio = { ok: true } | { ok: false; error: string };

/** Lo que se le cuenta al usuario cuando algo falla. El detalle va al log. */
const ERROR_GENERICO =
  "No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos o escríbenos a info@cameliainteriorismo.com.";

const noVacio = z.string().trim().min(1);
const email = z.string().trim().email();
/** Teléfono: 9 dígitos como mínimo, admitiendo prefijo, espacios y guiones. */
const telefono = z
  .string()
  .trim()
  .regex(/^[+()\d][\d\s().-]{7,}$/, "Teléfono no válido");

const articulo = z.object({
  title: noVacio,
  slug: noVacio,
  finish: z.string().trim().optional(),
  quantity: z.number().int().positive().max(999),
  notes: z.string().trim().max(2000).optional(),
});

const esquemaProducto = z.object({
  name: noVacio.max(200),
  taxId: noVacio.max(50),
  email,
  phone: telefono,
  deliveryMode: z.enum(["domicilio", "recogida"]),
  address: z.string().trim().max(300).optional(),
  postalCode: z.string().trim().max(20).optional(),
  city: z.string().trim().max(120).optional(),
  province: z.string().trim().max(120).optional(),
  items: z.array(articulo).min(1).max(50),
});

const esquemaProyecto = z.object({
  answers: z.record(z.string(), z.string().trim().max(5000)),
});

/** Fecha y hora en horario peninsular, que es donde está el estudio. */
function ahora() {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date());
}

/** Los datos del pie de los correos salen del panel, no del código. */
async function contactoEstudio(): Promise<Contacto> {
  const s = await sanityFetch<Contacto | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  return s ?? {};
}

/**
 * Manda los dos correos. El del estudio va primero: si solo uno pudiera
 * salir, es preferible que sea el que hace que la solicitud no se pierda.
 */
async function enviarPar(
  estudio: { subject: string; html: string; text: string },
  cliente: { subject: string; html: string; text: string },
  emailCliente: string,
) {
  await sendEmail({
    to: studioAddress(),
    ...estudio,
    // Responder al aviso escribe al cliente directamente.
    replyTo: emailCliente,
  });
  await sendEmail({ to: emailCliente, ...cliente });
}

export async function enviarSolicitudProducto(
  payload: unknown,
): Promise<ResultadoEnvio> {
  const parsed = esquemaProducto.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario." };
  }
  const datos = parsed.data;

  try {
    // Falla pronto si la configuración de correo no está puesta, antes de
    // pedirle nada a Sanity.
    assertEmailConfig();
    const contacto = await contactoEstudio();
    const solicitud = { ...datos, fecha: ahora() };

    await enviarPar(
      producto.emailEstudio(solicitud, contacto),
      producto.emailCliente(solicitud, contacto),
      datos.email,
    );

    return { ok: true };
  } catch (error) {
    console.error("[solicitud producto]", error);
    return { ok: false, error: ERROR_GENERICO };
  }
}

export async function enviarSolicitudProyecto(
  payload: unknown,
): Promise<ResultadoEnvio> {
  const parsed = esquemaProyecto.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario." };
  }
  const { answers } = parsed.data;

  // Los tres campos con los que el estudio puede responder. El resto del
  // formulario es contenido y puede variar; estos no.
  const contacto = z
    .object({ nombre: noVacio, email, telefono })
    .safeParse(answers);
  if (!contacto.success) {
    return {
      ok: false,
      error: "Revisa el nombre, el email y el teléfono antes de enviar.",
    };
  }

  try {
    assertEmailConfig();
    const datosEstudio = await contactoEstudio();
    const solicitud = { answers, fecha: ahora() };

    await enviarPar(
      proyecto.emailEstudio(solicitud, datosEstudio),
      proyecto.emailCliente(solicitud, datosEstudio),
      contacto.data.email,
    );

    return { ok: true };
  } catch (error) {
    console.error("[solicitud proyecto]", error);
    return { ok: false, error: ERROR_GENERICO };
  }
}
