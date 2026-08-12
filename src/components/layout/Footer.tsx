import Image from "next/image";
import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { Container } from "@/components/layout/Container";
import { CONTACT, SOCIALS, SOCIAL_URLS } from "@/features/contacto/data";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Estudio", href: "/estudio" },
  { label: "Metodología", href: "/metodologia" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Shop", href: "/tienda" },
  { label: "Blog", href: "/blog" },
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
              {SOCIALS.map(({ label, src }) => {
                const href = SOCIAL_URLS[label];
                const icon = (
                  <Image
                    src={src}
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5"
                  />
                );
                // LinkedIn has no URL yet — shown, but not as a dead link.
                return href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="transition-opacity hover:opacity-70"
                  >
                    {icon}
                  </a>
                ) : (
                  <span key={label} aria-hidden>
                    {icon}
                  </span>
                );
              })}
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
            {/* Bloque informativo, no navegación: nada de aquí es clicable ni
                tiene hover. Los únicos enlaces del pie son los de Navegación
                y los legales de abajo. */}
            <ul className="mt-4 space-y-3 text-sm font-light tracking-[-0.01em]">
              {/* Las dos líneas de la dirección van juntas dentro de un mismo
                  li, con su propio interlineado ajustado: se separan menos
                  entre sí (≈20px) que del resto de la lista (12px de
                  space-y-3 + altura de línea), así que se leen como un bloque
                  y no como dos datos distintos. */}
              <li className="leading-relaxed">
                {CONTACT.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </li>
              <li>{CONTACT.email}</li>
              {/* Desde CONTACT, no escrito a mano: el literal que había aquí
                  acababa en 12 01 y contradecía al de la página de Contacto. */}
              <li className="[word-spacing:0.3em]">{CONTACT.phone}</li>
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
