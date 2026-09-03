import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * El único punto por el que se emite JSON-LD. Serializa el objeto y escapa
 * `<` como `<` para que un texto que venga de Sanity no pueda cerrar la
 * etiqueta `<script>` e inyectar marcado.
 *
 * Es un Server Component: el schema viaja en el HTML inicial, que es donde un
 * buscador lo lee.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Quita las claves sin valor: un schema no debe declarar campos vacíos. */
function limpio<T extends Record<string, unknown>>(objeto: T) {
  return Object.fromEntries(
    Object.entries(objeto).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
}

type Ajustes = {
  email?: string;
  phone?: string;
  phoneHref?: string;
  addressStreet?: string;
  addressFloor?: string;
  addressLocality?: string;
  openingHours?: string[];
  socials?: { url?: string }[];
};

/**
 * El estudio. `ProfessionalService` y no `LocalBusiness` a secas: es un
 * negocio de servicios profesionales con sede física.
 *
 * Solo se declara lo que existe en siteSettings. Sin coordenadas, sin
 * valoraciones y sin horario estructurado: `openingHours` es texto libre en el
 * panel, así que se emite tal cual en vez de inventar un
 * `openingHoursSpecification` con días y horas que nadie ha introducido.
 */
export function servicioProfesional(ajustes: Ajustes) {
  const calle = [ajustes.addressStreet, ajustes.addressFloor]
    .filter(Boolean)
    .join(", ");
  const direccion = limpio({
    "@type": "PostalAddress",
    streetAddress: calle || undefined,
    addressLocality: ajustes.addressLocality,
  });
  const redes = (ajustes.socials ?? [])
    .map((s) => s.url)
    .filter((u): u is string => Boolean(u));

  return limpio({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    email: ajustes.email,
    telephone: ajustes.phone,
    address: Object.keys(direccion).length > 1 ? direccion : undefined,
    // `openingHours` es un array de texto libre en el panel: se emite tal
    // cual, sin convertirlo en un `openingHoursSpecification` con días y horas
    // que nadie ha introducido.
    openingHours: ajustes.openingHours?.length
      ? ajustes.openingHours
      : undefined,
    sameAs: redes.length ? redes : undefined,
  });
}

/** Sin `SearchAction`: la web no tiene buscador que declarar. */
export function sitioWeb() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

/**
 * `priceCurrency` es EUR: la tienda vende en euros y el símbolo ya se escribe
 * en la plantilla. `availability` sale del campo real `available` de Sanity,
 * no de una suposición. Sin `sku` ni `brand`: no existen en los datos.
 */
export function producto(p: {
  name: string;
  slug: string;
  description?: string;
  imagen?: string;
  categoria?: string;
  price?: number;
  available?: boolean;
}) {
  const oferta =
    p.price !== undefined || p.available !== undefined
      ? limpio({
          "@type": "Offer",
          price: p.price,
          priceCurrency: p.price === undefined ? undefined : "EUR",
          availability:
            p.available === undefined
              ? undefined
              : p.available
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          url: absoluteUrl(`/tienda/${p.slug}`),
        })
      : undefined;

  return limpio({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.imagen,
    category: p.categoria,
    url: absoluteUrl(`/tienda/${p.slug}`),
    offers: oferta,
  });
}
