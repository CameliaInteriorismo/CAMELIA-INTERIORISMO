import { Fragment } from "react";

/**
 * Pinta un texto respetando sus saltos de línea, con <br /> entre líneas.
 *
 * Varios títulos de la web se parten por un punto editorial concreto y lo
 * hacían con un <br /> escrito a mano. Al pasar a Sanity ese salto viaja
 * dentro del texto como \n, y esto lo devuelve al marcado sin cambiar nada
 * de cómo se ve.
 */
export function Multiline({ text }: { text?: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
