import { useEffect, useState } from "react";
import { Card, Text } from "@sanity/ui";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";

type Destacado = {
  _id: string;
  title: string | null;
  slug: string | null;
  order: number | null;
};

/**
 * "llum-de-vila" → "Llum de Vila". Solo se usa si el proyecto no tiene título.
 *
 * Los enlaces cortos van en minúscula, como se escriben de verdad: "de Vila",
 * no "De Vila". La primera palabra siempre sube, pase lo que pase.
 */
const ENLACES = new Set(["de", "del", "la", "las", "el", "los", "y", "en", "a"]);

function desdeSlug(slug: string | null) {
  if (!slug) return "Proyecto";
  return slug
    .split("-")
    .filter(Boolean)
    .map((w, i) =>
      i > 0 && ENLACES.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

/**
 * La lista de proyectos que ahora mismo alimentan la cuadrícula de la Home.
 *
 * No es un campo: no se guarda nada en `homePage` y no se elige aquí. Se
 * consulta en vivo con el MISMO criterio que usa la web pública en
 * `HOME_PAGE_QUERY` (`featured == true` y con slug), así que marcar o
 * desmarcar «Destacado en la Home» en un proyecto se refleja aquí solo.
 *
 * El `listen` mantiene la lista al día sin recargar el panel: si se cambia el
 * destacado de un proyecto en otra pestaña, esta lista se entera.
 */
export function FeaturedProjectsNote() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [items, setItems] = useState<Destacado[] | null>(null);

  useEffect(() => {
    const query = `*[_type == "project" && featured == true && defined(slug.current)] | order(order asc) { _id, title, "slug": slug.current, order }`;
    let vivo = true;
    const cargar = () =>
      client.fetch<Destacado[]>(query).then((r) => {
        if (vivo) setItems(r);
      });
    cargar();
    // El borrador cuenta: al marcar el destacado y antes de publicar, el
    // editor quiere ver el cambio reflejado.
    const sub = client
      .listen(query, {}, { visibility: "query" })
      .subscribe(() => cargar());
    return () => {
      vivo = false;
      sub.unsubscribe();
    };
  }, [client]);

  if (items === null) {
    return (
      <Text size={1} muted>
        Cargando…
      </Text>
    );
  }

  if (items.length === 0) {
    return (
      <Card padding={3} radius={2} tone="caution">
        <Text size={1}>
          Ningún proyecto está marcado como destacado, así que la cuadrícula de
          la Home está vacía. Marca «Destacado en la Home» en los proyectos que
          quieras mostrar.
        </Text>
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((p) => (
        <Card key={p._id} padding={3} radius={2} tone="transparent">
          {/* Abre el documento real del proyecto, no una copia. */}
          <IntentLink
            intent="edit"
            params={{ id: p._id, type: "project" }}
            style={{ textDecoration: "none" }}
          >
            <Text size={1}>{p.title || desdeSlug(p.slug)}</Text>
          </IntentLink>
        </Card>
      ))}
    </div>
  );
}
