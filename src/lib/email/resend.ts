import "server-only";
import { Resend } from "resend";

/**
 * El envío de correo, en un solo sitio y solo en servidor.
 *
 * `server-only` arriba: la clave de Resend no lleva `NEXT_PUBLIC_` y este
 * módulo no puede acabar en el navegador. Si alguien lo importa desde un
 * componente de cliente, la compilación falla en vez de filtrar la clave.
 *
 * Las tres variables se leen dentro de la función y no al cargar el módulo:
 * así el build no revienta en un entorno que todavía no las tenga puestas —el
 * fallo aparece al enviar, con un mensaje que dice cuál falta.
 */
type Correo = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

function config() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const studio = process.env.CONTACT_EMAIL;

  const faltan = [
    !apiKey && "RESEND_API_KEY",
    !from && "RESEND_FROM_EMAIL",
    !studio && "CONTACT_EMAIL",
  ].filter(Boolean);

  if (faltan.length) {
    throw new Error(
      `Faltan variables de entorno para el envío de correo: ${faltan.join(", ")}.`,
    );
  }

  return { apiKey: apiKey!, from: from!, studio: studio! };
}

/** El buzón del estudio, para saber a quién avisar. */
export function studioAddress() {
  return config().studio;
}

/**
 * Comprueba que se puede enviar, antes de tocar nada.
 *
 * Se llama al principio de la acción para que una configuración a medias
 * falle en el acto, sin haber consultado antes a Sanity ni construido cuatro
 * plantillas para nada.
 */
export function assertEmailConfig() {
  config();
}

/**
 * Envía un correo y devuelve su id. Lanza si Resend responde con error, para
 * que la acción de servidor pueda decidir qué contar al usuario: nunca se
 * muestra "enviado" si esto no ha salido bien.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: Correo) {
  const { apiKey, from } = config();
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
    // El correo del cliente va aquí y en `to`, nunca en `from`: mandar en
    // nombre de un dominio ajeno es lo que hace que un correo acabe en spam
    // —o que Resend lo rechace, porque el dominio no está verificado—. Así
    // el estudio responde al cliente con un clic y el remitente sigue siendo
    // Camelia.
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(`Resend: ${error.message ?? "error desconocido"}`);
  }

  return data?.id;
}
