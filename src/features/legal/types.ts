export type LegalBlock =
  | {
      type: "text";
      paragraphs: string[];
      /**
       * Phrases inside `paragraphs` to turn into links, matched verbatim.
       * Lets a clause point at another page ("…en nuestra Política de
       * Privacidad") without breaking the sentence into fragments here.
       */
      links?: LegalInlineLink[];
    }
  | { type: "list"; items: string[] }
  | { type: "details"; entries: LegalDetail[] }
  /** A titled block within a clause — 3.1, 3.2, "Cookies técnicas"… */
  | { type: "subsection"; title: string; blocks: LegalBlock[] }
  /**
   * Lines set tight against each other rather than as separate paragraphs —
   * a postal address, a lone email, a URL on its own line. Each may carry
   * an href.
   */
  | { type: "lines"; items: LegalLine[] };

export type LegalLine = {
  value: string;
  href?: string;
};

export type LegalInlineLink = {
  /** Exact substring to match inside a paragraph. */
  text: string;
  href: string;
};

export type LegalDetail = {
  label: string;
  value: string;
  /** Turns the value into a mailto:/tel:/https: link where it makes sense. */
  href?: string;
};

export type LegalSection = {
  /** Rendered as part of the heading, e.g. "1. Responsable…". */
  number: string;
  title: string;
  blocks: LegalBlock[];
};
