import type { SVGProps } from "react";

/**
 * Compact, understated hamburger — three hairline strokes (middle one
 * shorter, a quiet nod to the Figma reference) sized to sit quietly next to
 * "MENU" rather than dominate the bar. `vector-effect="non-scaling-stroke"`
 * keeps the hairline weight fixed regardless of render size (set via the
 * h-/w- classes on the caller) — scaling the icon never thickens the line.
 */
// Folded map — the "Abrir en Google Maps" action on Contacto's map card.
export function MapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="2 6 9 3 15 6 22 3 22 18 15 21 9 18 2 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

// Location pin — the "Recoger en el estudio" address block.
export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 18 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      {...props}
    >
      <line
        x1="0"
        y1="0.5"
        x2="18"
        y2="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <line x1="0" y1="6" x2="11" y2="6" vectorEffect="non-scaling-stroke" />
      <line
        x1="0"
        y1="11.5"
        x2="18"
        y2="11.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8-5.2-4.7 6.9-.7z" />
    </svg>
  );
}

// Diagonal "↘" — the accordion disclosure arrow used by Producto's
// DETALLES DE LA PIEZA / MATERIALES Y MEDIDAS / ENVÍO Y ENTREGA rows.
export function ArrowDownRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <polyline points="18 10 18 18 10 18" />
    </svg>
  );
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="10 6 4 12 10 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      {...props}
    >
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="5 9 12 16 19 9" />
    </svg>
  );
}

export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 4h2.2l1 12.2A2 2 0 0 0 8.2 18H18a2 2 0 0 0 2-1.7l1.2-7.3H6.4" />
      <circle cx="9.5" cy="21.5" r="1" />
      <circle cx="17.5" cy="21.5" r="1" />
    </svg>
  );
}
