import { headers } from "next/headers";

/**
 * Límite de peticiones en memoria, por clave (IP, email…).
 *
 * Es un freno de mejor esfuerzo, no una garantía: vive en la memoria de cada
 * instancia del servidor, así que varias instancias de Vercel no comparten
 * contador y un reinicio lo pone a cero. Basta para frenar a un bot sencillo
 * o un bucle descontrolado sin añadir ningún servicio externo; para un
 * ataque serio haría falta un almacén compartido (Upstash/Vercel KV) o el
 * firewall de Vercel.
 */
export function createLimiter({
  max,
  windowMs,
}: {
  max: number;
  windowMs: number;
}) {
  const hits = new Map<string, number[]>();

  return function allow(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);

    // Limpieza ocasional para que el mapa no crezca sin fin.
    if (hits.size > 5000) {
      for (const [k, list] of hits) {
        if (list.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }
    return true;
  };
}

/** IP del visitante tal y como la entrega Vercel; "desconocida" si no hay. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconocida"
  );
}
