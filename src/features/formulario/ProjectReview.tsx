"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { type Step } from "@/features/formulario/data";
import { StepFields } from "@/features/formulario/StepFields";
import { cn } from "@/utils/cn";

type Answers = Record<string, string>;

/** Un dato ya contestado, listo para mostrarse: su pregunta y su respuesta. */
type Campo = { label: string; value: string };

/**
 * Extrae de un paso los pares pregunta/respuesta que de verdad tienen algo
 * escrito. No inventa estructura: cada tipo de paso ya sabe cuáles son sus
 * datos (uno solo en "text"/"choice", varios en "long"/"fields"), así que
 * esto solo los recorre y descarta los vacíos — "detalles"/"objetivos" son
 * opcionales y pueden llegar aquí sin ningún campo.
 */
function camposDe(step: Step, answers: Answers): Campo[] {
  const noVacio = (c: Campo) => c.value?.trim().length > 0;

  switch (step.kind) {
    case "text":
    case "choice":
      return [{ label: step.title, value: answers[step.name] ?? "" }].filter(
        noVacio,
      );
    case "long":
    case "fields":
      return step.fields
        .map((f) => ({ label: f.label, value: answers[f.name] ?? "" }))
        .filter(noVacio);
    default:
      return [];
  }
}

/**
 * El título del propio paso ya sirve de encabezado de sección casi siempre
 * —es la misma pregunta que se hizo—, salvo en el paso de contacto: su
 * título ("Ya casi hemos terminado") anima a seguir rellenando, pero no
 * describe lo que hay debajo una vez contestado. `kind === "fields"`
 * identifica ese paso sin depender de su posición en el array.
 */
function tituloSeccion(step: Exclude<Step, { kind: "intro" }>): string {
  if (step.kind === "fields") return "Tus datos de contacto";
  return step.title;
}

export function ProjectReview({
  steps,
  answers,
  setAnswer,
  onVolver,
  onConfirmar,
  enviando,
  error,
}: {
  steps: Step[];
  answers: Answers;
  setAnswer: (name: string, value: string) => void;
  onVolver: () => void;
  onConfirmar: () => void;
  enviando: boolean;
  error?: string;
}) {
  // Qué sección está abierta para editar, si alguna. Un solo índice porque
  // solo tiene sentido tener una a la vez: abrir la siguiente cierra la
  // anterior, igual que un acordeón.
  const [editando, setEditando] = useState<number | null>(null);

  // El primer paso es la intro (sin datos); el resto son las preguntas
  // reales. Una sección por paso contestado — nada de agrupar a mano, así
  // esto se queda al día solo si el formulario gana o pierde una pregunta.
  const secciones = steps
    .map((step, index) => ({ step, index, campos: camposDe(step, answers) }))
    .filter(
      (
        s,
      ): s is {
        step: Exclude<Step, { kind: "intro" }>;
        index: number;
        campos: Campo[];
      } => s.step.kind !== "intro" && s.campos.length > 0,
    );

  return (
    <>
      <h1 className="font-title text-primary text-2xl md:text-3xl">
        Revisa tu información
      </h1>
      <p className="text-primary/70 mt-sm max-w-[30rem] text-sm leading-relaxed">
        Antes de enviar tu solicitud, comprueba que todo esté como quieres.
        Puedes editar cualquier apartado sin perder el resto.
      </p>

      <div className="mt-block">
        {secciones.map(({ step, index, campos }) => {
          const enEdicion = editando === index;
          return (
            <div key={index} className="border-primary/15 border-t py-block">

              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-title text-primary text-base">
                  {tituloSeccion(step)}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditando(enEdicion ? null : index)}
                  aria-expanded={enEdicion}
                  aria-label={
                    enEdicion
                      ? `Terminar de editar: ${tituloSeccion(step)}`
                      : `Editar: ${tituloSeccion(step)}`
                  }
                  className="text-primary shrink-0 text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  {enEdicion ? "Hecho" : "Editar"}
                </button>
              </div>

              {enEdicion ? (
                // Los mismos campos que el asistente, contra el mismo
                // `answers` — no hay un segundo estado que sincronizar ni un
                // paso al que volver: se edita aquí y ya está.
                <div className="mt-sm max-w-[30rem]">
                  <StepFields
                    step={step}
                    answers={answers}
                    setAnswer={setAnswer}
                  />
                </div>
              ) : (
                <div className="mt-sm grid grid-cols-1 gap-x-10 gap-y-sm sm:grid-cols-2 lg:grid-cols-3">
                  {campos.map((campo) => {
                    // Un paso de una sola pregunta (text/choice) ya lleva su
                    // pregunta en el título de la sección — repetirla como
                    // etiqueta del dato sería la misma frase dos veces
                    // seguidas.
                    const soloUnCampoIgualAlTitulo =
                      campos.length === 1 && campo.label === step.title;
                    return (
                      <div key={campo.label}>
                        {!soloUnCampoIgualAlTitulo && (
                          <p className="text-primary/60 text-xs tracking-[0.02em]">
                            {campo.label}
                          </p>
                        )}
                        <p
                          className={cn(
                            "text-primary text-sm leading-relaxed break-words",
                            !soloUnCampoIgualAlTitulo && "mt-1",
                          )}
                        >
                          {campo.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-secondary mt-sm text-xs">{error}</p>}

      {/* Mismo criterio que el asistente: juntos a la derecha desde `sm`,
          pero en un móvil pequeño cada uno a un extremo — el par pegado a
          la derecha ahí dejaba un tramo de ancho muerto a la izquierda que
          VOLVER no tenía motivo para dejar sin usar. */}
      <div className="mt-block flex items-center justify-between gap-4 sm:justify-end">
        <Button
          disabled={enviando}
          className="disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onVolver}
        >
          VOLVER
        </Button>
        <Button
          onClick={onConfirmar}
          disabled={enviando}
          className="disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? "ENVIANDO…" : "CONFIRMAR Y ENVIAR"}
        </Button>
      </div>
    </>
  );
}
