import { Container } from "@/components/layout/Container";
import { Multiline } from "@/features/shared/MultilineText";

export type ProcessStep = {
  _key: string;
  title: string;
  text: string;
  result?: string;
};

/**
 * «Cómo trabajamos, paso a paso»: el proceso en orden, con lo que pasa en
 * cada paso y lo que se lleva el cliente. Va todo abierto, sin acordeón: es
 * lo que más pregunta quien no ha hecho nunca una reforma con un estudio.
 */
export function ProcessSteps({
  steps,
  title,
}: {
  steps: ProcessStep[];
  title?: string;
}) {
  if (steps.length === 0) return null;
  return (
    <section className="pt-section">
      <Container>
        {title && (
          <h2 className="font-title text-primary text-3xl md:text-4xl">
            <Multiline text={title} />
          </h2>
        )}
        <ol className="mt-content">
          {steps.map((step, i) => (
            <li key={step._key} className="border-primary/15 border-t py-8">
              {/* Rejilla propia y no <Grid>: en móvil el número va al lado del
                  título, y el hueco vertical de <Grid> (32px) separaba
                  demasiado cada paso de su texto. */}
              <div className="grid grid-cols-12 items-baseline gap-x-2 gap-y-3 md:gap-x-8">
                <span
                  aria-hidden
                  className="font-title text-auxiliary col-span-2 text-4xl md:col-span-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-title text-primary col-span-10 text-2xl md:col-span-4">
                  {step.title}
                </h3>
                <div className="col-span-12 md:col-span-6 md:col-start-7">
                  <p className="text-primary text-sm leading-relaxed">
                    {step.text}
                  </p>
                  {step.result && (
                    <p className="text-primary mt-sm text-sm">
                      <span className="font-medium">Te llevas: </span>
                      {step.result}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
