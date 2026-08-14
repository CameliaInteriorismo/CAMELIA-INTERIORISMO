import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import type { Product, ShopCopy } from "@/features/tienda/types";

// Los rótulos vienen de Sanity; estos son solo el texto de reserva por si
// alguien los vacía en el panel. En mayúsculas literales, no con una
// transformación de CSS: así se escriben todos los rótulos del sitio, y el
// Accordion compartido se queda sin opinión sobre las mayúsculas.
const DETAIL_LABELS: Record<keyof NonNullable<Product["details"]>, string> = {
  detallesDeLaPieza: "DETALLES DE LA PIEZA",
  materialesYMedidas: "MATERIALES Y MEDIDAS",
  envioYEntrega: "ENVÍO Y ENTREGA",
};

// Embedded directly in ProductHero's right column, beside the image —
// not a standalone section below the fold. Only fields with real content
// become accordion items.
export function ProductInfo({
  product,
  copy = {},
}: {
  product: Product;
  copy?: ShopCopy;
}) {
  const items: AccordionItem[] = Object.entries(DETAIL_LABELS)
    .filter(([key]) => product.details?.[key as keyof typeof DETAIL_LABELS])
    .map(([key, label]) => ({
      question: copy.detailLabels?.[key as keyof typeof DETAIL_LABELS] ?? label,
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
