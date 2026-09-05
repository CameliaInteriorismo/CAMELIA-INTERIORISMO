import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Endurecimiento estándar, sin coste real para esta web: nada aquí necesita
  // ser embebido en un iframe ajeno, así que denegarlo por completo no rompe
  // nada. `nosniff` evita que el navegador reinterprete un fichero como un
  // tipo distinto del que declara su `Content-Type`. El `Referrer-Policy`
  // solo iguala por escrito lo que los navegadores ya traen por defecto.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  images: {
    // 75 is Next's own default, for anything at card size or below.
    //
    // 90 is what the full-bleed hero photography uses. It replaced 100:
    // at 100 a hero came out of the optimiser at 784KB (3840px wide on a
    // retina screen), against 85KB at the default — a nine-fold difference
    // that showed up directly as pages taking a second to settle. 90 keeps
    // the grain and gradients of a hero clean while landing far closer to
    // the small end. Any value not listed here is rejected outright by the
    // optimiser, which is why it has to be declared.
    qualities: [75, 90, 100],
    // Las imágenes gestionadas desde Sanity se sirven desde su CDN. Sin
    // declarar el dominio, next/image las rechaza y la página devuelve un 500.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
