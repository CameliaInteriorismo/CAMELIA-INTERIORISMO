import { Fragment } from "react";

/**
 * Pinta un texto respetando los saltos de línea que trae del panel.
 *
 * Cada línea sale como un `<span className="block">`, no separada por un
 * `<br />`. La diferencia importa: el salto es una decisión de diseño —
 * "PORTFOLIO" arriba y "Proyectos de Camelia" debajo—, y como bloque el
 * navegador no puede deshacerlo aunque le sobre ancho para juntarlas.
 *
 * Dentro de cada línea el texto sí fluye con normalidad, así que en una
 * pantalla muy estrecha una línea larga puede partirse sola. Lo que nunca
 * ocurre es que dos líneas distintas acaben pegadas.
 *
 * No lleva estilos propios: hereda tamaño, peso e interlineado del titular
 * que lo contiene.
 */
export function Multiline({ text }: { text?: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  if (lines.length === 1) return <>{text}</>;
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className="block">{line}</span>
        </Fragment>
      ))}
    </>
  );
}
