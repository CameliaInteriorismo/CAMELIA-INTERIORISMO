import { z } from "zod";
import { clientIp, createLimiter } from "@/lib/security/rateLimit";

/**
 * Lo que manda el navegador junto a cada solicitud para distinguir a una
 * persona de un bot. Ver `useFormGuard` en el cliente.
 *
 * - `hp`: campo trampa. Está oculto; una persona no lo ve y lo deja vacío,
 *   un bot que rellena todos los campos lo llena.
 * - `t`: cuándo se abrió el formulario. Una persona tarda más que unos
 *   segundos en rellenarlo; un envío directo no.
 */
export const esquemaGuard = z.object({
  hp: z.string().max(200),
  t: z.number(),
});

/** Menos de esto desde que se abre el formulario no lo envía una persona. */
const MIN_MS = 8_000;
/** Un formulario abierto más de un día se da por caducado. */
const MAX_MS = 24 * 60 * 60 * 1000;

// 3 solicitudes por IP cada 10 minutos: de sobra para una persona, poco para
// un bot.
const porIp = createLimiter({ max: 3, windowMs: 10 * 60 * 1000 });
// Cada solicitud manda un correo de confirmación AL email indicado: sin este
// tope el formulario serviría para inundar de correos a un tercero desde el
// dominio del estudio.
const porEmail = createLimiter({ max: 2, windowMs: 60 * 60 * 1000 });

export type Veredicto =
  | { pasa: true }
  /** Bot probable: se responde como si hubiera ido bien, sin enviar nada. */
  | { pasa: false; silencioso: true }
  /** Persona con prisa o repetición: se le explica. */
  | { pasa: false; silencioso?: false; error: string };

export async function revisarGuard(
  guard: unknown,
  email: string,
): Promise<Veredicto> {
  const parsed = esquemaGuard.safeParse(guard);
  if (!parsed.success) return { pasa: false, silencioso: true };

  const { hp, t } = parsed.data;
  const edad = Date.now() - t;
  if (hp.trim() !== "" || edad < MIN_MS || edad > MAX_MS) {
    return { pasa: false, silencioso: true };
  }

  const ip = await clientIp();
  if (!porIp(`ip:${ip}`) || !porEmail(`email:${email.toLowerCase()}`)) {
    return {
      pasa: false,
      error:
        "Has enviado varias solicitudes seguidas. Espera unos minutos o escríbenos a info@cameliainteriorismo.com.",
    };
  }
  return { pasa: true };
}
