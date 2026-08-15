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
    <section className="pt-[100px]">
      <Container>
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          <Multiline text={title} />
        </h2>
        <p className="text-primary/75 mt-md text-sm leading-relaxed">{text}</p>
      </Container>
    </section>
  );
}
