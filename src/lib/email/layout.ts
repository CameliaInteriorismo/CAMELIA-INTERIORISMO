import "server-only";

/**
 * La carcasa común de los cuatro correos.
 *
 * Todo va en estilos en línea y sin tipografías web: los clientes de correo
 * descartan las hojas de estilo y las `@font-face`, así que una plantilla
 * "bonita" con CSS externo llega rota. Con estilos en línea y familias del
 * sistema se ve igual en Gmail, Apple Mail y Outlook.
 *
 * Los colores son los de la marca —vino y crema— escritos en hexadecimal
 * porque las variables CSS del sitio tampoco viajan al correo.
 */
const VINO = "#3f0e1a";
const CREMA = "#fcf7ec";
const BORDE = "#e6ddcc";

export type Contacto = {
  siteName?: string;
  email?: string;
  phone?: string;
  addressStreet?: string;
  addressFloor?: string;
  addressLocality?: string;
};

/** Escapa lo que escribe el usuario antes de meterlo en el HTML del correo. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Una fila de la tabla de datos. Se omite sola si el valor viene vacío. */
export function fila(label: string, value?: string | null): string {
  if (!value || !String(value).trim()) return "";
  return `<tr>
    <td style="padding:8px 16px 8px 0;vertical-align:top;color:${VINO};opacity:.6;font-size:13px;white-space:nowrap;">${esc(label)}</td>
    <td style="padding:8px 0;vertical-align:top;color:${VINO};font-size:14px;">${esc(value).replace(/\n/g, "<br>")}</td>
  </tr>`;
}

export function tabla(filas: string): string {
  const contenido = filas.trim();
  if (!contenido) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:24px 0;">${contenido}</table>`;
}

export function titulo(texto: string): string {
  return `<h2 style="margin:32px 0 0;color:${VINO};font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:normal;letter-spacing:.04em;text-transform:uppercase;">${esc(texto)}</h2>`;
}

export function parrafo(texto: string): string {
  return `<p style="margin:16px 0 0;color:${VINO};opacity:.8;font-size:14px;line-height:1.7;">${texto}</p>`;
}

/** El pie con los datos del estudio, tal como están en Ajustes del sitio. */
function pie(c: Contacto): string {
  const direccion = [c.addressStreet, c.addressFloor, c.addressLocality]
    .filter(Boolean)
    .join(", ");
  const lineas = [
    c.siteName ? `<strong style="font-weight:600;">${esc(c.siteName)}</strong>` : "",
    direccion ? esc(direccion) : "",
    c.phone ? esc(c.phone) : "",
    c.email
      ? `<a href="mailto:${esc(c.email)}" style="color:${VINO};text-decoration:underline;">${esc(c.email)}</a>`
      : "",
  ].filter(Boolean);

  return `<div style="margin-top:40px;padding-top:24px;border-top:1px solid ${BORDE};color:${VINO};opacity:.7;font-size:13px;line-height:1.8;">
    ${lineas.join("<br>")}
  </div>`;
}

/** Envuelve el cuerpo del correo con la cabecera, el pie y el preheader. */
export function envoltorio({
  preheader,
  encabezado,
  cuerpo,
  contacto,
}: {
  preheader: string;
  encabezado: string;
  cuerpo: string;
  contacto: Contacto;
}): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(encabezado)}</title></head>
<body style="margin:0;padding:0;background:${CREMA};">
  <!-- El preheader es la línea de vista previa de la bandeja: se oculta en el
       cuerpo pero los clientes la leen. Sin ella, la vista previa muestra el
       primer trozo de markup que encuentre. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${CREMA};">
    <tr>
      <td align="center" style="padding:40px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;text-align:left;">
          <tr>
            <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              <h1 style="margin:0;color:${VINO};font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;line-height:1.3;">
                ${esc(encabezado)}
              </h1>
              ${cuerpo}
              ${pie(contacto)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** La versión en texto plano, para clientes que no pintan HTML. */
export function textoPlano(
  encabezado: string,
  bloques: (string | [string, string | undefined | null])[],
  contacto: Contacto,
): string {
  const lineas: string[] = [encabezado, ""];
  for (const bloque of bloques) {
    if (typeof bloque === "string") {
      lineas.push(bloque, "");
    } else {
      const [label, value] = bloque;
      if (value && String(value).trim()) lineas.push(`${label}: ${value}`);
    }
  }
  const direccion = [
    contacto.addressStreet,
    contacto.addressFloor,
    contacto.addressLocality,
  ]
    .filter(Boolean)
    .join(", ");
  lineas.push(
    "",
    "—",
    contacto.siteName ?? "",
    direccion,
    contacto.phone ?? "",
    contacto.email ?? "",
  );
  return lineas.filter((l) => l !== undefined).join("\n");
}
