import "server-only";

/**
 * Apunta en Nora (el programa interno del estudio) cada solicitud de
 * «Cuéntanos tu proyecto», para que salga en Comercial → «Consultas de la web»
 * y se pueda convertir en oferta con su origen ya puesto.
 *
 * Es un añadido, no la vía segura: la solicitud siempre llega por correo. Por
 * eso aquí nada puede romper el formulario. Sin las dos variables no se hace
 * nada (en local, en las vistas previas); si Nora no contesta —el NAS apagado,
 * el túnel caído— se apunta en el log y ya está.
 *
 * Las dos variables van sin `NEXT_PUBLIC_` y este módulo es `server-only`: la
 * clave es un secreto de servidor y no puede acabar en el navegador.
 */
const ESPERA_MS = 8000;

export async function avisarANora(answers: Record<string, string>) {
  const url = process.env.NORA_WEB_URL?.trim();
  const clave = process.env.NORA_WEB_CLAVE?.trim();
  if (!url || !clave) return;

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Nora-Web": clave },
      body: JSON.stringify({ answers }),
      signal: AbortSignal.timeout(ESPERA_MS),
      cache: "no-store",
    });
    if (!respuesta.ok) {
      console.error(
        "[nora] la consulta no ha entrado:",
        respuesta.status,
        (await respuesta.text()).slice(0, 200),
      );
    }
  } catch (error) {
    console.error("[nora] no se ha podido avisar:", error);
  }
}
