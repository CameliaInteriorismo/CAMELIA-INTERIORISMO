"use client";

import { AddressAutocomplete } from "@/features/formulario/AddressAutocomplete";
import { type Step } from "@/features/formulario/data";
import { fieldClass } from "@/features/formulario/styles";
import { cn } from "@/utils/cn";

type Answers = Record<string, string>;

/**
 * The help line, with `helpBold` set in bold where a step asks for it (the
 * optional-section notice). Split rather than stored as markup so the copy
 * stays a plain sentence in the data file.
 */
export function renderHelp(step: Exclude<Step, { kind: "intro" }>) {
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

/**
 * Los controles de un paso, sin su título ni su ayuda — solo la parte que de
 * verdad se contesta. Vive en su propio módulo (no en ProjectForm ni en
 * ProjectReview) para que los dos puedan importarla sin que uno dependa del
 * otro: el asistente la usa para el paso activo, la revisión la reutiliza
 * tal cual al editar en el sitio — mismo campo, mismo `onChange`, mismo
 * `answers`, sin un segundo formulario que pueda desincronizarse del
 * primero.
 */
export function StepFields({
  step,
  answers,
  setAnswer,
}: {
  step: Exclude<Step, { kind: "intro" }>;
  answers: Answers;
  setAnswer: (name: string, value: string) => void;
}) {
  return (
    <>
      {step.kind === "text" && (
        <div className="mt-block md:max-w-[30rem]">
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
        <div className="mt-block space-y-block md:max-w-[30rem]">
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
          the contact-details screen (FORMULARIO CONTACTO 10). Grid, not a
          plain stack: `half` fields (nombre, teléfono) share a row from
          `md`, which is what keeps this the shortest it can be without
          dropping a field. Below `md` it's one column regardless — `half`
          only matters once there's room for two. The 480px cap is also
          `md:`-only, same reason as the "text"/"long" fields above. */}
      {step.kind === "fields" && (
        <div className="mt-block grid grid-cols-1 gap-x-6 gap-y-block md:grid-cols-2 md:max-w-[30rem]">
          {step.fields.map((field) => (
            <div key={field.name} className={field.half ? "" : "md:col-span-2"}>
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
    </>
  );
}
