"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enviarSolicitudProyecto } from "@/lib/requests/actions";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container, Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { type Step } from "@/features/formulario/data";
import { ProjectReview } from "@/features/formulario/ProjectReview";
import { renderHelp, StepFields } from "@/features/formulario/StepFields";
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
 * Qué falta en un paso, si algo falta. La misma comprobación sirve para
 * avanzar de paso en paso y para revalidar todo de un tirón antes de
 * confirmar desde la revisión —editar ahí no vuelve a pasar por `next()`,
 * así que sin esto un campo obligatorio vaciado durante la edición podría
 * colarse hasta el envío.
 */
function validarPaso(
  step: Step,
  answers: Answers,
): string | undefined {
  if (step.kind === "intro") return undefined;
  // "long" is explicitly optional per the reference; every other question
  // must be answered before moving on.
  if (step.kind === "text" || step.kind === "choice") {
    if (!answers[step.name]?.trim()) return "Completa este campo para continuar";
  }
  // El paso de contacto es el único con varias respuestas en una pantalla:
  // se exige que las tres tengan algo, no basta con una.
  if (step.kind === "fields") {
    if (step.fields.some((field) => !answers[field.name]?.trim())) {
      return "Completa todos los campos para continuar";
    }
  }
  // Email y teléfono, con forma además de con contenido: son las dos vías
  // por las que el estudio responde, y una errata aquí deja la solicitud
  // sin respuesta posible. El servidor lo vuelve a comprobar.
  if (step.kind === "fields") {
    if (answers.email !== undefined && !EMAIL.test(answers.email.trim())) {
      return "Revisa el correo electrónico";
    }
    if (
      answers.telefono !== undefined &&
      !TELEFONO.test(answers.telefono.trim())
    ) {
      return "Revisa el teléfono";
    }
  }
  return undefined;
}

function StepBody({
  step,
  answers,
  setAnswer,
}: {
  step: Step;
  answers: Answers;
  setAnswer: (name: string, value: string) => void;
}) {
  if (step.kind === "intro") return null;

  return (
    <>
      <h1 className="font-title text-primary text-2xl md:text-3xl">
        {step.title}
      </h1>
      {step.help && (
        <p className="text-primary/70 mt-sm text-sm leading-relaxed md:max-w-[30rem]">
          {renderHelp(step)}
        </p>
      )}

      <StepFields step={step} answers={answers} setAnswer={setAnswer} />
    </>
  );
}

const MOVIL_QUERY = "(max-width: 767px)";

function leerAnchoMovil(): boolean {
  return window.matchMedia(MOVIL_QUERY).matches;
}

function suscribirAAnchoMovil(avisar: () => void): () => void {
  const mql = window.matchMedia(MOVIL_QUERY);
  mql.addEventListener("change", avisar);
  return () => mql.removeEventListener("change", avisar);
}

/**
 * Une en una sola página los pasos consecutivos que compartan
 * `mobileGroup` — pero solo cuando `agruparEnMovil` es cierto. En desktop
 * (o antes de saber en qué ancho estamos) cada paso es su propia página,
 * uno a uno, igual que siempre.
 */
function agruparPasos(steps: Step[], agruparEnMovil: boolean): number[][] {
  const paginas: number[][] = [];
  for (let i = 0; i < steps.length; i++) {
    const grupo = steps[i].mobileGroup;
    const ultima = paginas[paginas.length - 1];
    const mismoGrupo =
      agruparEnMovil &&
      grupo !== undefined &&
      ultima !== undefined &&
      steps[ultima[0]].mobileGroup === grupo;
    if (mismoGrupo) {
      ultima.push(i);
    } else {
      paginas.push([i]);
    }
  }
  return paginas;
}

export function ProjectForm({ steps }: { steps: Step[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const shift = reduceMotion ? 0 : STEP_SHIFT;
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string>();
  // Al terminar el último paso no se envía todavía: se enseña una revisión
  // de todo lo contestado. `answers`/`pageIndex` no se tocan al entrar ni al
  // salir de este modo, así que "Editar" y "Volver" son gratis — es el
  // mismo formulario, solo cambia qué se pinta.
  const [revisando, setRevisando] = useState(false);
  // Apaga los dos botones mientras el envío está en vuelo: sin esto, un
  // doble clic en FINALIZAR dispara dos solicitudes, y serían dos números y
  // dos pares de correos por el mismo proyecto.
  const [enviando, setEnviando] = useState(false);
  // `false` en el servidor (no hay `matchMedia` ahí) y en el primer render
  // del cliente, así que hidratación no tiene nada que reconciliar; en
  // cuanto React puede leer el media query de verdad, se actualiza sola —
  // sin el `useEffect` + `setState` de montaje que dispara un render en
  // cascada evitable.
  const agruparEnMovil = useSyncExternalStore(
    suscribirAAnchoMovil,
    leerAnchoMovil,
    () => false,
  );

  const pages = agruparPasos(steps, agruparEnMovil);
  // `agruparEnMovil` puede cambiar en vivo si alguien redimensiona la
  // ventana cruzando los 768px a mitad de formulario — raro, pero real. El
  // acotamiento es solo para no reventar contra un índice que ya no existe;
  // no intenta aterrizar en la pregunta "equivalente" de la nueva agrupación.
  const pagina = pages[Math.min(pageIndex, pages.length - 1)];
  const pageSteps = pagina.map((i) => steps[i]);
  const primero = pageSteps[0];
  const isLast = pageIndex === pages.length - 1;
  // La primera página es la intro, sin dato que contestar; el resto son las
  // preguntas reales, numeradas desde 1. Se oculta en la intro (nada
  // empezado aún) y en la revisión (ya no es "un paso más", es otra cosa).
  const totalPasos = pages.length - 1;
  const pasoActual = pageIndex;
  const mostrarProgreso = !revisando && pageIndex >= 1;

  function setAnswer(name: string, value: string) {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setError(undefined);
  }

  function next() {
    for (const s of pageSteps) {
      const problema = validarPaso(s, answers);
      if (problema) {
        setError(problema);
        return;
      }
    }
    if (isLast) {
      setError(undefined);
      setRevisando(true);
      return;
    }
    setError(undefined);
    setPageIndex((i) => i + 1);
  }

  /**
   * Revalida los pasos reales de un tirón antes de enviar — uno por uno, no
   * página por página: agrupar en móvil cambia cómo se enseñan, no qué hace
   * falta rellenar. Editar en la propia revisión ya no pasa por `next()`,
   * así que sin esto alguien podría vaciar un campo obligatorio ahí y llegar
   * a confirmar con la solicitud a medias. Si algo falla, se sale de la
   * revisión y se aterriza en la página que contiene ese paso — el mismo
   * criterio de siempre: nunca "vuelve al principio del formulario", vuelve
   * al apartado exacto.
   */
  function revisarYEnviar() {
    for (let i = 0; i < steps.length; i++) {
      const problema = validarPaso(steps[i], answers);
      if (problema) {
        setError(problema);
        setRevisando(false);
        setPageIndex(pages.findIndex((p) => p.includes(i)));
        return;
      }
    }
    void enviar();
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
          <div className="flex h-20 items-center justify-between">
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
            {/* Un numeral discreto, no una cuenta atrás ostentosa: la misma
                voz que "N.º DE PEDIDO" en los correos, aplicada aquí a
                dónde va la persona dentro del formulario. Sin aria-hidden:
                es justo el dato que alguien con lector de pantalla necesita
                para saber cuánto le queda, igual que lo ve quien mira la
                pantalla. */}
            {mostrarProgreso && (
              <p className="text-primary/60 text-xs tracking-[0.08em]">
                {String(pasoActual).padStart(2, "0")}
                <span className="text-primary/30" aria-hidden>
                  {" "}
                  ·{" "}
                </span>
                {String(totalPasos).padStart(2, "0")}
              </p>
            )}
          </div>
        </Container>
      </header>

      {/* La misma línea fina que ya separa la cabecera del resto —aquí se le
          da uso: el tramo recorrido se pinta en vino sólido, el resto se
          queda en el mismo vino al 10% que usan las demás rayas del sitio
          (el pie, los separadores de la revisión). A todo el ancho, como el
          borde de la cabecera del que cuelga — no dentro del Container,
          que la encogería a los 1120px del contenido y perdería el
          apoyo visual de venir "de la propia cabecera". */}
      {mostrarProgreso && (
        <div
          className="bg-primary/10 h-px w-full"
          role="progressbar"
          aria-label="Progreso del formulario"
          aria-valuemin={0}
          aria-valuemax={totalPasos}
          aria-valuenow={pasoActual}
          aria-valuetext={`Pregunta ${pasoActual} de ${totalPasos}`}
        >
          <motion.div
            className="bg-primary h-px"
            animate={{ width: `${(pasoActual / totalPasos) * 100}%` }}
            transition={{ duration: STEP_IN, ease: EASE }}
          />
        </div>
      )}

      <main className="py-section flex flex-1 items-center">
        <Container className="w-full">
          {/* Stretch, not centre en la fila: la altura la marca la foto (ver
              su min-h más abajo), y el texto arranca arriba dentro de ese
              alto —`justify-start`, no `justify-center`— para que cada
              pregunta empiece siempre en el mismo punto, sea corta o larga.
              Centrarla verticalmente es lo que hacía que una pregunta corta
              pareciera "flotando" en mitad del hueco. */}
          <Grid className="items-stretch">
            {/* 6 columns, not 5: the reference gives the copy ~520px of a
                1440 page, and at 5/12 (442px) the intro headline no longer
                fits on its two intended lines.

                La revisión ocupa las 12: es una lista de datos, no una
                pregunta con foto al lado, y necesita el ancho para no
                sentirse apretada. */}
            <div
              className={cn(
                "col-span-12 flex flex-col justify-start",
                !revisando && "md:col-span-6",
              )}
            >
              {/* Each step hands over in place rather than the page
                  re-rendering wholesale, so the split composition holds
                  steady while only the question changes. La revisión entra
                  con la misma transición, como un paso más del mismo viaje. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={revisando ? "revision" : pageIndex}
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
                  {revisando ? (
                    <ProjectReview
                      steps={steps}
                      answers={answers}
                      setAnswer={setAnswer}
                      enviando={enviando}
                      error={error}
                      onVolver={() => {
                        setError(undefined);
                        setRevisando(false);
                      }}
                      onConfirmar={revisarYEnviar}
                    />
                  ) : primero.kind === "intro" ? (
                    <>
                      {/* ~60px at desktop, matching the reference — one
                          step under the hero scale, which at 72px broke
                          "Hablemos de" onto a second line. */}
                      <h1 className="font-title text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {primero.title.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h1>
                      <div className="text-primary/75 mt-block space-y-6 text-sm leading-relaxed md:max-w-[30rem]">
                        {primero.paragraphs.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                      <Button onClick={next} className="mt-block">
                        {primero.cta}
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Casi siempre un único paso. Cuando `agruparPasos` ha
                          unido varios (móvil, mismo `mobileGroup`), solo el
                          primero lleva título y ayuda — es lo que da
                          contexto a todo el grupo, como antes de partirlos.
                          Los siguientes enseñan solo la pregunta: para
                          "long"/"fields" ya es lo que hace `StepFields`
                          (el rótulo de cada campo), así que basta con no
                          llamar a `StepBody`; "choice" no trae ese rótulo
                          propio, así que aquí se le pone uno con el mismo
                          tratamiento que ya usaban los grupos de radios
                          antes de separarse en pasos. El espaciado entre
                          preguntas lo pone el propio `mt-block` con el que
                          ya arranca cada bloque de campos — el mismo salto
                          que separaba los campos dentro de un único paso
                          "long" cuando "detalles" era uno solo. */}
                      {pageSteps.map((s, i) =>
                        i === 0 ? (
                          <StepBody
                            key={i}
                            step={s}
                            answers={answers}
                            setAnswer={setAnswer}
                          />
                        ) : s.kind === "intro" ? null : (
                          // La intro nunca comparte grupo (no lleva
                          // `mobileGroup`), así que un `i > 0` real jamás cae
                          // aquí — esta rama solo existe para que TypeScript
                          // vea excluido "intro" antes de pasar `s` a
                          // `StepFields`, que no lo acepta.
                          <div key={i} className={s.kind === "choice" ? "mt-block" : undefined}>
                            {/* Mismo tamaño que el título de la primera
                                pregunta del grupo: son dos preguntas del
                                mismo peso, no una principal y una nota al
                                pie. `h2`, no `h1` —ya hay uno en esta
                                página—, pero con sus mismas clases. */}
                            {s.kind === "choice" && (
                              <h2 className="font-title text-primary text-2xl md:text-3xl">
                                {s.title}
                              </h2>
                            )}
                            <StepFields
                              step={s}
                              answers={answers}
                              setAnswer={setAnswer}
                            />
                          </div>
                        ),
                      )}
                      {error && (
                        <p className="text-secondary mt-sm text-xs">{error}</p>
                      )}
                      {/* Right-aligned to the same edge the fields end on
                          (max-w-[30rem]) from `md`, not to the column —
                          that's the composition in every mockup: copy set
                          left, the pair of buttons pushed to the far right
                          of the text block with 60px of air above them.
                          Below `md` that cap is off: the text column is the
                          full stacked width there (no fixed column to match),
                          and capping it at 480px anyway is what left the
                          field and this row visibly short of the photo's own
                          edge on any phone wider than ~530px.

                          Only below `sm` the two spread to each edge instead
                          — on a small phone the pair sitting together on the
                          right left a dead stretch of empty width on the
                          left that ATRÁS had no reason to leave unused. */}
                      <div className="mt-block flex items-center justify-between gap-4 sm:justify-end md:max-w-[30rem]">
                        <Button
                          disabled={enviando}
                          className="disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => {
                            setError(undefined);
                            setPageIndex((i) => Math.max(0, i - 1));
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
                los dos y daban 64px donde el sistema pide 32.

                No se pinta en la revisión: no hay una foto por sección, y
                dejar la última del formulario puesta ahí sugeriría que
                pertenece a un dato que ya no se está mostrando. */}
            {!revisando && (
            <div className="col-span-12 max-md:order-first md:col-span-6 md:col-start-7">
              {/* One height for every step of the form, never shorter than
                  the copy beside it.

                  `h-full` in a stretched row means the photo always fills
                  whatever height the row takes, so the text can't run past
                  its bottom edge at any width. The 500px floor is what makes
                  that height identical from step to step — down from 810px,
                  then 680px, now that "detalles" and the old two-group
                  "¿Cómo prefieres que hablemos?" are one question per screen
                  each: measured live at 768/1280px across all twelve steps,
                  the tallest ones left standing ("Tengo en mente el
                  siguiente proyecto…" and "Inversión estimada", both
                  six-option choices, neither touched by this round) never
                  exceed 468px, so 500px clears them with room to spare.
                  Below 768 the container's side padding can still squeeze
                  the copy taller than that, and there the photo grows with
                  it rather than letting the text overflow.

                  The aspect ratio only governs the stacked mobile layout,
                  where there is no second column to match. */}
              {/* En móvil pasa de 3/4 a 3/2: a 3/4 la foto medía unos 490px
                  de alto y se comía la pantalla entera antes de llegar a la
                  primera pregunta. Apaisada acompaña sin tapar el
                  formulario. `object-cover` recorta, nunca deforma, y desde
                  `md` sigue mandando `md:aspect-auto`.

                  Por debajo de `sm` (móvil pequeño) sube a 4/3, un poco más
                  alta: en pantallas así de estrechas 3/2 se quedaba
                  demasiado baja. De `sm` a `md` sigue en 3/2, sin tocar. */}
              <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2] md:aspect-auto md:h-full md:min-h-[500px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={primero.image}
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
                      src={primero.image}
                      alt=""
                      aria-hidden
                      fill
                      priority
                      // Apilada, la caja es apaisada y la foto vertical, así
                      // que el recorte centrado se quedaba con la franja
                      // media y perdía el motivo de arriba. `max-md:` lo
                      // limita al móvil: desde md la caja ya acompaña a la
                      // foto y el encuadre centrado de siempre sigue igual.
                      //
                      // Salvo que el paso pida otra franja: no todas las fotos
                      // tienen su motivo arriba (ver `encuadreMovil`). Los
                      // pasos que comparten `mobileGroup` comparten también
                      // foto, así que leerlo del primero basta.
                      className={cn(
                        "object-cover",
                        primero.encuadreMovil === "center"
                          ? "max-md:object-center"
                          : primero.encuadreMovil === "bottom"
                            ? "max-md:object-bottom"
                            : "max-md:object-top",
                      )}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
}
