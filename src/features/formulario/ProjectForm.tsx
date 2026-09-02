"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enviarSolicitudProyecto } from "@/lib/requests/actions";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { AddressAutocomplete } from "@/features/formulario/AddressAutocomplete";
import { type Step } from "@/features/formulario/data";
import { fieldClass } from "@/features/formulario/styles";
import { cn } from "@/utils/cn";

type Answers = Record<string, string>;

/** Las mismas dos formas que valida el servidor, para avisar antes de enviar. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO = /^[+()\d][\d\s().-]{7,}$/;

const EASE = [0.4, 0, 0.2, 1] as const;

// Step-to-step transition: a short horizontal drift under a fade, always
// running the same way round — the outgoing step leaves to the left and the
// incoming one arrives from the right whether you pressed SIGUIENTE or ATRÁS,
// so the flow reads as one screen handing over to the next rather than as a
// direction-aware carousel. Kept to 24px and well under half a second: the
// movement should be felt, not watched.
const STEP_SHIFT = 24;
const STEP_IN = 0.3;
const STEP_OUT = 0.18;

/**
 * The help line, with `helpBold` set in bold where a step asks for it (the
 * optional-section notice). Split rather than stored as markup so the copy
 * stays a plain sentence in the data file.
 */
function renderHelp(step: Exclude<Step, { kind: "intro" }>) {
  const help = step.help;
  if (!help) return null;

  const bold = "helpBold" in step ? step.helpBold : undefined;
  if (!bold || !help.includes(bold)) return help;

  const [before, ...rest] = help.split(bold);
  return (
    <>
      {before}
      <strong className="text-primary font-semibold">{bold}</strong>
      {rest.join(bold)}
    </>
  );
}

function StepBody({
  step,
  answers,
  setAnswer,
  error,
}: {
  step: Step;
  answers: Answers;
  setAnswer: (name: string, value: string) => void;
  error?: string;
}) {
  if (step.kind === "intro") return null;

  return (
    <>
      <h1 className="font-title text-primary text-2xl md:text-3xl">
        {step.title}
      </h1>
      {step.help && (
        <p className="text-primary/70 mt-sm max-w-[30rem] text-sm leading-relaxed">
          {renderHelp(step)}
        </p>
      )}

      {step.kind === "text" && (
        <div className="mt-block max-w-[30rem]">
          {step.autocomplete === "address" ? (
            <AddressAutocomplete
              value={answers[step.name] ?? ""}
              onChange={(next) => setAnswer(step.name, next)}
              placeholder={step.placeholder}
            />
          ) : (
            <input
              value={answers[step.name] ?? ""}
              onChange={(e) => setAnswer(step.name, e.target.value)}
              placeholder={step.placeholder}
              inputMode={step.inputMode}
              className={cn(fieldClass, "h-11")}
            />
          )}
        </div>
      )}

      {step.kind === "choice" && (
        <div className="mt-block space-y-3">
          {step.options.map((option) => (
            <label
              key={option}
              className="flex w-fit cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name={step.name}
                checked={answers[step.name] === option}
                onChange={() => setAnswer(step.name, option)}
                className="accent-primary h-4 w-4"
              />
              <span className="text-primary text-sm">{option}</span>
            </label>
          ))}
        </div>
      )}

      {step.kind === "long" && (
        <div className="mt-block space-y-block max-w-[30rem]">
          {step.fields.map((field) => (
            <div key={field.name}>
              <p className="text-primary mb-2 text-sm leading-relaxed">
                {field.label}
              </p>
              <textarea
                rows={3}
                value={answers[field.name] ?? ""}
                onChange={(e) => setAnswer(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={cn(fieldClass, "resize-none py-3 leading-relaxed")}
              />
            </div>
          ))}
        </div>
      )}

      {/* Same label + input pairing as "long" above, just single-line —
          the contact-details screen (FORMULARIO CONTACTO 10). */}
      {step.kind === "fields" && (
        <div className="mt-block space-y-block max-w-[30rem]">
          {step.fields.map((field) => (
            <div key={field.name}>
              <p className="text-primary mb-2 text-sm leading-relaxed">
                {field.label}
              </p>
              <input
                type={field.type ?? "text"}
                value={answers[field.name] ?? ""}
                onChange={(e) => setAnswer(field.name, e.target.value)}
                placeholder={field.placeholder}
                inputMode={field.inputMode}
                className={cn(fieldClass, "h-11")}
              />
            </div>
          ))}
        </div>
      )}

      {/* Two radio groups on one screen (FORMULARIO CONTACTO 11). Each group
          renders exactly like a "choice" step's options — same spacing, same
          control — under its own label, set like the field labels above. */}
      {step.kind === "choiceGroups" && (
        <div className="mt-block space-y-block">
          {step.groups.map((group) => (
            <div key={group.name}>
              <p className="text-primary mb-4 text-sm leading-relaxed">
                {group.label}
              </p>
              <div className="space-y-3">
                {group.options.map((option) => (
                  <label
                    key={option}
                    className="flex w-fit cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name={group.name}
                      checked={answers[group.name] === option}
                      onChange={() => setAnswer(group.name, option)}
                      className="accent-primary h-4 w-4"
                    />
                    <span className="text-primary text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-secondary mt-sm text-xs">{error}</p>}
    </>
  );
}

export function ProjectForm({ steps }: { steps: Step[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const shift = reduceMotion ? 0 : STEP_SHIFT;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string>();
  // Apaga los dos botones mientras el envío está en vuelo: sin esto, un
  // doble clic en FINALIZAR dispara dos solicitudes, y serían dos números y
  // dos pares de correos por el mismo proyecto.
  const [enviando, setEnviando] = useState(false);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  function setAnswer(name: string, value: string) {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setError(undefined);
  }

  function next() {
    // "long" is explicitly optional per the reference; every other
    // question must be answered before moving on.
    if (step.kind === "text" || step.kind === "choice") {
      if (!answers[step.name]?.trim()) {
        setError("Completa este campo para continuar");
        return;
      }
    }
    // The multi-answer screens gate on every one of their parts, so a
    // half-filled contact block or a single picked group can't slip past.
    if (step.kind === "fields" || step.kind === "choiceGroups") {
      const parts = step.kind === "fields" ? step.fields : step.groups;
      if (parts.some((part) => !answers[part.name]?.trim())) {
        setError(
          step.kind === "fields"
            ? "Completa todos los campos para continuar"
            : "Elige una opción en cada apartado para continuar",
        );
        return;
      }
    }
    // Email y teléfono, con forma además de con contenido: son las dos vías
    // por las que el estudio responde, y una errata aquí deja la solicitud
    // sin respuesta posible. Se comprueba en el paso donde se piden, para
    // avisar ahí y no al final. El servidor lo vuelve a comprobar.
    if (step.kind === "fields") {
      if (answers.email !== undefined && !EMAIL.test(answers.email.trim())) {
        setError("Revisa el correo electrónico");
        return;
      }
      if (
        answers.telefono !== undefined &&
        !TELEFONO.test(answers.telefono.trim())
      ) {
        setError("Revisa el teléfono");
        return;
      }
    }
    if (isLast) {
      void enviar();
      return;
    }
    setError(undefined);
    setIndex((i) => i + 1);
  }

  async function enviar() {
    if (enviando) return;
    setEnviando(true);
    setError(undefined);

    const resultado = await enviarSolicitudProyecto({ answers });

    // Solo se pasa a la pantalla de gracias si los correos han salido. Si
    // fallan, la persona se queda aquí con sus respuestas y puede reintentar
    // sin volver a rellenar los diez pasos.
    if (!resultado.ok) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }
    router.push("/cuentanos-tu-proyecto/gracias");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-primary/15 border-b">
        <Container>
          <div className="flex h-20 items-center">
            <Link href="/" aria-label="Camelia — inicio">
              <Image
                src="/images/logos/trimmed/Camelia logo sin fondo vino actualizado.png"
                alt="Camelia"
                width={828}
                height={130}
                priority
                className="h-5 w-auto"
              />
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-section flex flex-1 items-center">
        <Container className="w-full">
          {/* Stretch, not centre: the row's height is set by the photo (see
              its min-h below) and the copy is centred against it by its own
              `justify-center`. Centring the grid items instead would let the
              row collapse to the taller column, which is exactly what made
              the photo shorter than the text on the long steps. */}
          <Grid className="items-stretch">
            {/* 6 columns, not 5: the reference gives the copy ~520px of a
                1440 page, and at 5/12 (442px) the intro headline no longer
                fits on its two intended lines. */}
            <div className="col-span-12 flex flex-col justify-center md:col-span-6">
              {/* Each step hands over in place rather than the page
                  re-rendering wholesale, so the split composition holds
                  steady while only the question changes. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: shift }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: STEP_IN, ease: EASE },
                  }}
                  exit={{
                    opacity: 0,
                    x: -shift,
                    transition: { duration: STEP_OUT, ease: EASE },
                  }}
                >
                  {step.kind === "intro" ? (
                    <>
                      {/* ~60px at desktop, matching the reference — one
                          step under the hero scale, which at 72px broke
                          "Hablemos de" onto a second line. */}
                      <h1 className="font-title text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {step.title.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h1>
                      <div className="text-primary/75 mt-block max-w-[30rem] space-y-6 text-sm leading-relaxed">
                        {step.paragraphs.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                      <Button onClick={next} className="mt-block">
                        {step.cta}
                      </Button>
                    </>
                  ) : (
                    <>
                      <StepBody
                        step={step}
                        answers={answers}
                        setAnswer={setAnswer}
                        error={error}
                      />
                      {/* Right-aligned to the same edge the fields end on
                          (max-w-[30rem]), not to the column — that's the
                          composition in every mockup: copy set left, the
                          pair of buttons pushed to the far right of the
                          text block with 60px of air above them. */}
                      <div className="mt-block flex max-w-[30rem] items-center justify-end gap-4">
                        <Button
                          disabled={enviando}
                          className="disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => {
                            setError(undefined);
                            setIndex((i) => Math.max(0, i - 1));
                          }}
                        >
                          ATRÁS
                        </Button>
                        <Button
                          onClick={next}
                          disabled={enviando}
                          className="disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {enviando
                            ? "ENVIANDO…"
                            : isLast
                              ? "FINALIZAR"
                              : "SIGUIENTE"}
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 6 columns, not 5. The reference gives the photo 545px of a
                1440 page — 48.7% of the container — where 5/12 left it at
                442px (40%), noticeably smaller than drawn. */}
            {/* Apilado, la foto va DELANTE del texto: abría la página con un
                bloque de copia y la imagen quedaba fuera de pantalla, sin
                anunciar de qué va el formulario. `max-md:` lo limita al
                apilado — desde `md` el orden lo sigue marcando
                `md:col-start-7` y la composición no se toca.

                Sale también el `mt-block`: con la foto arriba ese margen se
                colaba entre la cabecera y la imagen, y la separación con el
                texto ya la pone el `gap-y-8` de la rejilla. Antes se sumaban
                los dos y daban 64px donde el sistema pide 32. */}
            <div className="col-span-12 max-md:order-first md:col-span-6 md:col-start-7">
              {/* One height for every step of the form, never shorter than
                  the copy beside it.

                  `h-full` in a stretched row means the photo always fills
                  whatever height the row takes, so the text can't run past
                  its bottom edge at any width. The 810px floor is what makes
                  that height identical from step to step: the tallest block
                  in the whole form ("Algunos detalles…", three textareas)
                  measures 767px at 1440 and 803px at 1280, so every step
                  clears the floor and lands on exactly 810px. Below 1280 the
                  container's 160px side padding squeezes the copy tall
                  enough to push past it, and there the photo grows with it
                  rather than letting the text overflow.

                  The aspect ratio only governs the stacked mobile layout,
                  where there is no second column to match. */}
              {/* En móvil pasa de 3/4 a 3/2: a 3/4 la foto medía unos 490px
                  de alto y se comía la pantalla entera antes de llegar a la
                  primera pregunta. Apaisada acompaña sin tapar el
                  formulario. `object-cover` recorta, nunca deforma, y desde
                  `md` sigue mandando `md:aspect-auto`. */}
              <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[810px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step.image}
                    // Pure crossfade — no drift. The photo stays put while
                    // the copy slides, and it runs on the same clock as the
                    // left column so both halves settle together.
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: STEP_IN, ease: EASE },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: STEP_OUT, ease: EASE },
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={step.image}
                      alt=""
                      aria-hidden
                      fill
                      priority
                      // Apilada, la caja es apaisada y la foto vertical, así
                      // que el recorte centrado se quedaba con la franja
                      // media y perdía el motivo de arriba. `max-md:` lo
                      // limita al móvil: desde md la caja ya acompaña a la
                      // foto y el encuadre centrado de siempre sigue igual.
                      className="object-cover max-md:object-top"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
