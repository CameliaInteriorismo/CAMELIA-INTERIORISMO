import { Container } from "@/components/layout/Container";
import { Accordion } from "@/components/ui/Accordion";
import { Multiline } from "@/features/shared/MultilineText";

export type FaqItem = { _key: string; question: string; answer: string };

export function FaqSection({
  items,
  title,
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section className="pt-[120px] pb-[120px]">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          <Multiline text={title} />
        </h2>

        <Accordion items={items} className="mt-title" />
      </Container>
    </section>
  );
}
