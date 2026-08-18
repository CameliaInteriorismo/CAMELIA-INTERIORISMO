import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { LEGAL_TITLE_SCALE } from "@/components/ui/typography";
import { cn } from "@/utils/cn";

/**
 * The reading measure shared by every legal page — header and body alike,
 * so the title and the text it introduces sit on the same left edge.
 *
 * 576px holds the line near 78 characters at the site's 14px body; the full
 * 1120px container would run to about 99, past comfortable reading for
 * documents this long. A fixed cap rather than a column span on purpose:
 * the grid's gutters stay 32px at every width, so a 6-of-12 span would
 * collapse to ~330px on a tablet. Below 576px it goes full width, where the
 * viewport is already the limit.
 *
 * Centred in the container, and everything on the page lives inside it —
 * title, clause headings, prose. Nothing breaks the column, which is what
 * lets the whole document read as one centred editorial block. The type
 * sizes are chosen to fit this width (see LEGAL_TITLE_SCALE and the h2 in
 * LegalDocument) rather than the column being stretched to fit the type.
 */
export const LEGAL_MEASURE = "mx-auto w-full max-w-[36rem]";

/**
 * The shell every legal page shares — Aviso Legal, Política de Privacidad,
 * Política de Cookies, Accesibilidad Web, and anything added later.
 *
 * Deliberately *not* PageHeroBanner: legal pages open on a plain cream
 * field with nothing but the H1 on it. No photo, no video, no full-viewport
 * band — the title reads as an introduction to the document rather than as
 * a visual hero. Because there is no hero to float over, these routes stay
 * out of Navbar's `hasHero` list and keep the normal solid sticky bar.
 *
 * Everything else is the site's own system: same Container, same side
 * margins, 60px from the navbar (as on the blog article and Contacto, the
 * site's other pages that open straight onto content), and 100px from the
 * title down to the body — the same gap every interior page leaves between
 * its hero and its content. The title runs at its own reduced scale (see
 * LEGAL_TITLE_SCALE) so it fits the centred reading column.
 */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="pt-section">
        <Container>
          <div className={LEGAL_MEASURE}>
            {/* One line, always — no editorial break here, unlike the rest
                of the site's H1s. That's the single rule across every legal
                page, so only the words change from one to the next, and the
                scale is set small enough (40px) that even the longest title
                holds its line inside the column. */}
            <h1 className={cn("font-title text-primary", LEGAL_TITLE_SCALE)}>
              {title}
            </h1>
          </div>
        </Container>
      </section>

      {children}
    </>
  );
}
