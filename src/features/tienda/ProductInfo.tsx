import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import type { Product } from "@/features/tienda/types";

// Literal caps (not a CSS transform) — matches how every other all-caps
// label on the site (e.g. "CUÉNTANOS TU PROYECTO") is written directly,
// keeping the shared Accordion itself free of a case opinion.
const DETAIL_LABELS: Record<keyof NonNullable<Product["details"]>, string> = {
  detallesDeLaPieza: "DETALLES DE LA PIEZA",
  materialesYMedidas: "MATERIALES Y MEDIDAS",
  envioYEntrega: "ENVÍO Y ENTREGA",
};

// Embedded directly in ProductHero's right column, beside the image —
// not a standalone section below the fold. Only fields with real content
// become accordion items.
export function ProductInfo({ product }: { product: Product }) {
  const items: AccordionItem[] = Object.entries(DETAIL_LABELS)
    .filter(([key]) => product.details?.[key as keyof typeof DETAIL_LABELS])
    .map(([key, label]) => ({
      question: label,
      answer: product.details![key as keyof typeof DETAIL_LABELS]!,
    }));

  if (items.length === 0) return null;

  return (
    <Accordion
      items={items}
      independent
      compact
      icon="arrow"
      className="mt-block"
    />
  );
}
