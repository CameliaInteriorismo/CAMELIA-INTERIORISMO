import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next añade por defecto `X-Powered-By: Next.js`: no aporta nada al visitante
  // y le dice a quien escanea la web qué tecnología (y qué avisos de
  // seguridad) buscar.
  poweredByHeader: false,
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
          // La web no usa cámara, micrófono, geolocalización, pagos ni
          // sensores: se desactivan para que ni un script de terceros ni un
          // iframe puedan pedirlos en su nombre.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()",
          },
          // Parte de la Content-Security-Policy que NO depende de qué scripts
          // carga la página y por tanto no puede romperla: nadie puede
          // enmarcar la web, cambiar su <base>, enviar formularios a otro
          // dominio ni cargar plugins (`object`); y todo lo que sea http se
          // sube solo a https. La política completa con `script-src` queda
          // pendiente: en Next obliga a renderizar cada página en cada visita
          // (nonce) y hay que probarla con Analytics, el Pixel y el Studio.
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
          },
        ],
      },
    ];
  },
  // Dirección de la web antigua en WordPress que Google aún conoce.
  async redirects() {
    return [
      {
        source: "/politica-de-privacidad-1",
        destination: "/politica-de-privacidad",
        permanent: true,
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
