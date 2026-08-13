import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidationFor } from "@/sanity/lib/revalidation";

/**
 * Webhook de Sanity: publicas un cambio y la web se refresca sola.
 *
 * Sin esto, `sanityFetch` cachea una hora y ese es el retraso con el que se
 * ven los cambios. El webhook no acorta esa hora para todo el mundo: lo que
 * hace es invalidar SOLO lo que depende del documento publicado, en el
 * momento. El resto de la web sigue sirviéndose de caché, que es lo que la
 * mantiene rápida.
 *
 * La ruta es dinámica y no se cachea nunca: es un receptor de eventos, no
 * una página.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    // Sin secreto no se valida nada, así que se prefiere fallar antes que
    // aceptar peticiones de cualquiera.
    return Response.json(
      { message: "Falta SANITY_REVALIDATE_SECRET en el entorno." },
      { status: 500 },
    );
  }

  let body: { _type?: string; slug?: { current?: string } } | null = null;
  // parseBody devuelve null cuando la petición no trae cabecera de firma.
  let isValidSignature: boolean | null = false;

  try {
    // La firma va en la cabecera sanity-webhook-signature y se comprueba
    // contra el cuerpo crudo: sin esto, cualquiera podría tirar la caché de
    // la web entera llamando a esta URL.
    ({ body, isValidSignature } = await parseBody<{
      _type?: string;
      slug?: { current?: string };
    }>(request, secret));
  } catch {
    return Response.json({ message: "Cuerpo ilegible." }, { status: 400 });
  }

  if (!isValidSignature) {
    return Response.json({ message: "Firma no válida." }, { status: 401 });
  }
  if (!body?._type) {
    return Response.json(
      { message: "El webhook no envía _type." },
      { status: 400 },
    );
  }

  const plan = revalidationFor(body._type);
  if (!plan) {
    // Un tipo que la web no lee (o uno nuevo sin mapear). Se responde 200
    // para que Sanity no lo marque como fallo y lo reintente en bucle.
    return Response.json({
      revalidated: false,
      type: body._type,
      message: "Ese tipo no alimenta ninguna página.",
    });
  }

  // Etiquetas: invalidan las respuestas de Sanity cacheadas.
  //
  // El segundo argumento es obligatorio en Next 16 y no es cosmético:
  // `{ expire: 0 }` caduca la entrada ahora mismo. El perfil "max" que
  // sugiere el aviso de deprecación no la caducaba, y la página se
  // regeneraba volviendo a leer la respuesta vieja.
  for (const tag of plan.tags) revalidateTag(tag, { expire: 0 });

  // Rutas: invalidan la página ya renderizada, que es lo que de verdad ve
  // el visitante. Sin esto el cambio no aparece hasta que caduque la hora.
  for (const { path, type } of plan.paths) revalidatePath(path, type);

  return Response.json({
    revalidated: true,
    type: body._type,
    slug: body.slug?.current,
    tags: plan.tags,
    paths: plan.paths.map((p) => p.path),
    now: Date.now(),
  });
}
