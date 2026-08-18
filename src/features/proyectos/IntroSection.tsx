import { Container } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";

export function IntroSection({
  title,
  text,
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="pt-section">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>
        <p className="text-primary/75 mt-content text-sm leading-relaxed">
          {text}
        </p>
      </Container>
    </section>
  );
}
