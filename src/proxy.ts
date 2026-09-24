import { NextResponse } from "next/server";

// Restos de la web antigua en WordPress que Google sigue rastreando
// (Search Console, septiembre de 2026). Un 410 le dice que se han ido para
// siempre, y las olvida antes que con un 404 o una redirección a la portada.
export function proxy() {
  return new NextResponse("Gone", {
    status: 410,
    headers: { "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  matcher: [
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/feed/:path*",
    "/comments/feed/:path*",
  ],
};
