import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt y `noindex` hacen cosas distintas: esto impide el RASTREO, y el
 * `robots` del metadata de cada página impide la INDEXACIÓN. Las rutas
 * transaccionales llevan las dos cosas a propósito.
 *
 * No se bloquea `/_next/`: Google necesita el CSS y el JS para renderizar las
 * páginas públicas y juzgarlas como las ve un usuario.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio/",
        "/carrito",
        "/carrito/confirmacion",
        "/carrito/gracias",
        "/cuentanos-tu-proyecto/gracias",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
