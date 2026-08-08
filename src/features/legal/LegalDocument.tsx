import { Fragment, type ReactElement, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { LEGAL_MEASURE } from "@/features/legal/LegalPage";
import type {
  LegalBlock,
  LegalDetail,
  LegalInlineLink,
  LegalSection,
} from "@/features/legal/types";

/** The site's body copy, unchanged: 14px, 75% vino, relaxed leading. */
const BODY = "text-primary/75 text-sm leading-relaxed";

/** The one link treatment on these pages — a hairline rule that darkens. */
const LINK =
  "border-primary/30 hover:border-primary border-b transition-colors duration-300";

/**
 * Splits a paragraph on each linked phrase and wraps the matches in anchors,
 * so a clause can point at another page mid-sentence without the copy being
 * chopped into fragments back in the data file.
 */
type Piece = string | ReactElement;

function withLinks(paragraph: string, links?: LegalInlineLink[]): ReactNode {
  if (!links?.length) return paragraph;

  // Each pass splits the plain-text pieces on one phrase and swaps the
  // matches for anchors; pieces that are already anchors are left alone, so
  // two links in one sentence don't nest.
  let pieces: Piece[] = [paragraph];
  for (const link of links) {
    const next: Piece[] = [];
    for (const piece of pieces) {
      if (typeof piece !== "string" || !piece.includes(link.text)) {
        next.push(piece);
        continue;
      }
      piece.split(link.text).forEach((chunk, index) => {
        if (index > 0) {
          next.push(
            <a
              key={`${link.href}-${next.length}`}
              href={link.href}
              className={LINK}
            >
              {link.text}
            </a>,
          );
        }
        if (chunk) next.push(chunk);
      });
    }
    pieces = next;
  }

  return pieces.map((piece, index) => <Fragment key={index}>{piece}</Fragment>);
}

function DetailValue({ entry }: { entry: LegalDetail }) {
  if (!entry.href) return <>{entry.value}</>;
  return (
    <a
      href={entry.href}
      target={entry.href.startsWith("http") ? "_blank" : undefined}
      rel={entry.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="border-primary/30 hover:border-primary border-b transition-colors duration-300"
    >
      {entry.value}
    </a>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className={`${BODY} space-y-6`}>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{withLinks(paragraph, block.links)}</p>
          ))}
        </div>
      );

    case "list":
      return (
        <ul className={`${BODY} marker:text-primary/40 space-y-2 pl-5`}>
          {block.items.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      );

    case "details":
      // A definition list, not a table or a panel: the label column is set
      // in solid vino against the 75% body, which is the only distinction
      // it needs — no rules, no fill, nothing boxed.
      return (
        <dl className="space-y-4">
          {block.entries.map((entry) => (
            // Each pair is its own row rather than two cells of one grid:
            // stacked on mobile the label has to sit tight against its own
            // value (4px) and well clear of the next pair (16px), which a
            // single grid with one row gap can't tell apart.
            <div
              key={entry.label}
              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            >
              <dt className="text-primary w-36 shrink-0 text-sm">
                {entry.label}
              </dt>
              <dd className={BODY}>
                <DetailValue entry={entry} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case "lines":
      // An address, a lone email, a URL — lines that belong together and
      // would read as unrelated statements at the 24px paragraph rhythm.
      return (
        <div className={`${BODY} space-y-1`}>
          {block.items.map((item) => (
            <p key={item.value}>
              <DetailValue entry={{ label: item.value, ...item }} />
            </p>
          ))}
        </div>
      );

    case "subsection":
      return (
        <div>
          {/* One step under its clause heading. The numbering ("3.1") and
              the 40px of air above it carry most of the distinction at this
              size; the type only has to not compete. */}
          <h3 className="font-title text-primary text-base md:text-lg">
            {block.title}
          </h3>
          {/* Nested blocks, not just paragraphs: a subsection may run copy,
              then a list, then more copy (see the cookie types). */}
          {block.blocks.map((child, index) => (
            <div key={index} className={index === 0 ? "mt-sm" : "mt-block"}>
              <Block block={child} />
            </div>
          ))}
        </div>
      );
  }
}

/**
 * Renders any legal document from its sections — Aviso Legal, Política de
 * Privacidad, and whatever follows. The layout is fixed here on purpose so
 * every legal page shares one rhythm and only its words differ.
 */
export function LegalDocument({
  lead,
  sections,
}: {
  /**
   * Unnumbered opening paragraphs, before clause 1 — the Cookies policy
   * starts on one. Rendered as plain body copy under the H1, so the page
   * opens on a sentence rather than straight on a heading.
   */
  lead?: string[];
  sections: LegalSection[];
}) {
  return (
    // 60px below the title — the site's title-to-content step, not the
    // 100px hero-to-content one: at 40px the legal H1 heads its document
    // rather than standing off from it as a hero would. The closing 100px
    // before the footer is unchanged, as is the 100px between clauses.
    <section className="pt-title pb-[100px]">
      <Container>
        {/* Same centred measure as the title above it (see LEGAL_MEASURE):
            nothing on a legal page breaks the column, so the document reads
            as one block from the H1 down to the last clause. */}
        <div className={LEGAL_MEASURE}>
          {lead && <Block block={{ type: "text", paragraphs: lead }} />}

          {sections.map((section, index) => (
            <section
              key={section.number}
              // Each clause is its own block of the page — a full 100px
              // of air between them, so scrolling lands on one at a time.
              // The lead paragraphs above count as a block of their own.
              className={index === 0 && !lead ? undefined : "mt-[100px]"}
            >
              {/* 20px so every clause heading holds a single line inside
                  the 576px column — the longest ("11. Google Analytics y
                  herramientas de medición") runs 527px here and 632px at
                  24px, which would break it in two. Small, but the display
                  face, the uppercase and the solid vino against the body's
                  75% keep it plainly a heading. */}
              <h2 className="font-title text-primary text-lg uppercase md:text-xl">
                {section.number}. {section.title}
              </h2>

              {section.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="mt-block">
                  <Block block={block} />
                </div>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
