import "server-only";
import { urlFor, type SanityImageSource } from "@/sanity/lib/image";
import { STEPS, type Step } from "@/features/formulario/data";

/**
 * Superpone los textos editados en Sanity sobre la estructura del formulario,
 * que se queda en el código.
 *
 * El reparto es deliberado:
 *
 * - En CÓDIGO: `kind` (qué tipo de pantalla es), `name` (la clave con la que
 *   se guarda cada respuesta), los nombres de los campos y el orden. De ahí
 *   sale el esquema Zod y el payload del envío; editarlos desde el panel
 *   dejaría el formulario sin validar o perdiendo respuestas.
 * - En SANITY: títulos, ayudas, textos guía, opciones, textos de botón e
 *   imágenes. Todo lo que se lee, nada de lo que decide.
 *
 * Si un paso no existe en Sanity, o no se encuentra su clave, se queda con lo
 * que trae el código. Así el formulario nunca aparece vacío ni a medias.
 */
export type FormStepContent = {
  key?: string;
  title?: string;
  titleLines?: string[];
  paragraphs?: string[];
  help?: string;
  helpBold?: string;
  placeholder?: string;
  cta?: string;
  options?: string[];
  fieldLabels?: { name?: string; label?: string; placeholder?: string }[];
  image?: SanityImageSource;
};

/** La misma clave que usó la migración: el `name` del paso, o kind-índice. */
function keyOf(step: Step, index: number): string {
  return "name" in step && step.name ? step.name : `${step.kind}-${index}`;
}

export function mergeSteps(content: FormStepContent[] = []): Step[] {
  const byKey = new Map(content.filter((c) => c.key).map((c) => [c.key, c]));

  return STEPS.map((step, index) => {
    const edited = byKey.get(keyOf(step, index));
    if (!edited) return step;

    // Se parte del paso del código y solo se pisan los campos de texto que
    // Sanity trae rellenos: un campo vacío en el panel no borra el original.
    const merged: Step = { ...step };
    const image = edited.image ? urlFor(edited.image).url() : undefined;

    if (image) merged.image = image;

    if (merged.kind === "intro") {
      if (edited.titleLines?.length) merged.title = edited.titleLines;
      if (edited.paragraphs?.length) merged.paragraphs = edited.paragraphs;
      if (edited.cta) merged.cta = edited.cta;
      return merged;
    }

    if (edited.title) merged.title = edited.title;
    // `help` existe en todos los pasos salvo el de bienvenida.
    if (edited.help) merged.help = edited.help;

    if (merged.kind === "text" && edited.placeholder) {
      merged.placeholder = edited.placeholder;
    }
    if (merged.kind === "choice" && edited.options?.length) {
      merged.options = edited.options;
    }
    if (merged.kind === "long" && edited.helpBold) {
      merged.helpBold = edited.helpBold;
    }

    // Los rótulos de campo se emparejan por `name`, nunca por posición: así
    // reordenarlos en el panel no reetiqueta el campo equivocado.
    if (
      (merged.kind === "long" || merged.kind === "fields") &&
      edited.fieldLabels
    ) {
      const labels = new Map(
        edited.fieldLabels.filter((f) => f.name).map((f) => [f.name, f]),
      );
      merged.fields = merged.fields.map((field) => {
        const l = labels.get(field.name);
        return l
          ? {
              ...field,
              label: l.label || field.label,
              placeholder: l.placeholder || field.placeholder,
            }
          : field;
      });
    }

    return merged;
  });
}
