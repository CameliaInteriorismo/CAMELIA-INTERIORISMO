import Image from "next/image";
import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { Container } from "@/components/layout/Container";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Estudio", href: "/estudio" },
  { label: "Metodología", href: "/metodologia" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Tienda", href: "/tienda" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

// Fixed order, set by the studio. "Configuración de cookies" sits fourth as
// a button rather than a link — it reopens the consent panel instead of
// navigating (see ConsentSettingsLink), which is why it isn't in this list.
const LEGAL_LINKS_BEFORE_SETTINGS = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];

const LEGAL_LINKS_AFTER_SETTINGS = [
  { label: "Accesibilidad", href: "/accesibilidad" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", src: "/assets/icons/ins.png" },
  { label: "TikTok", src: "/assets/icons/tiktok.png" },
  { label: "LinkedIn", src: "/assets/icons/linkedin.png" },
];

export function Footer() {
  return (
    <footer className="bg-background text-primary">
      {/* Línea a sangre completa: 1px, vino, muy poca opacidad. El margen de
          160px empieza únicamente en el contenido de debajo, no en la línea. */}
      <div className="bg-primary/10 h-px w-full" />

      <Container>
        {/* Flex + justify-between (no grid de columnas iguales): la primera
            columna queda anclada al margen izquierdo, la última al derecho,
            y Navegación/Contacto se reparten el espacio entre ambas con
            huecos uniformes — igual que en Figma, sin forzar anchos iguales. */}
        <div className="flex flex-col gap-y-12 py-20 md:flex-row md:flex-nowrap md:justify-between">
          <div>
            <Image
              src="/assets/logo/trimmed/Camelia logo sin fondo vino.png"
              alt="Camelia"
              width={828}
              height={130}
              className="h-6 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed font-light">
              Estudio de interiorismo en Valencia. Diseñamos espacios pensados
              para habitarse, vivirse y sentirse propios.
            </p>
            <div className="mt-6 flex gap-4">
              {SOCIAL_LINKS.map(({ label, src }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="transition-opacity hover:opacity-70"
                >
                  <Image
                    src={src}
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5"
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-normal tracking-[0.06em]">Navegación</p>
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-normal tracking-[0.06em]">Contacto</p>
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              <li>Alzira, Valencia (España)</li>
              <li>
                <a href="mailto:info@cameliainteriorismo.com">
                  info@cameliainteriorismo.com
                </a>
              </li>
              <li>
                <a href="tel:+34601531201" className="[word-spacing:0.3em]">
                  +34 601 53 12 01
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-normal tracking-[0.06em]">Horario</p>
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              <li>Lunes a viernes:</li>
              <li>9:00h - 13:30h</li>
              <li>16:00h - 19:00h</li>
            </ul>
          </div>
        </div>

        <div className="border-primary/10 flex flex-col gap-4 border-t py-8 text-xs font-light md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Camelia Interiorismo. Todos los
            derechos reservados
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS_BEFORE_SETTINGS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
            <ConsentSettingsLink className="transition-opacity hover:opacity-70" />
            {LEGAL_LINKS_AFTER_SETTINGS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
