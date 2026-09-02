import "server-only";
import { BASE_ASSETS, EMAIL_ASSETS } from "@/lib/email/assets";

/**
 * La carcasa común de los cuatro correos.
 *
 * Todo va en tablas y estilos en línea, no porque sea bonito sino porque es
 * lo único que sobrevive: Gmail descarta las hojas de estilo, Outlook pinta
 * con el motor de Word y ninguno de los dos entiende flexbox, grid ni
 * variables CSS. Las tablas anidadas son el equivalente en correo a un
 * contenedor centrado.
 *
 * Colores de marca en hexadecimal, muestreados de los propios logotipos:
 * las variables CSS del sitio tampoco viajan hasta aquí.
 */
const VINO = "#3f0e1a";
const ROJO = "#c7414e";
const CREMA = "#fcf7ec";
/**
 * El vino aclarado sobre el crema, para la información secundaria —el
 * "Acabado · Cantidad" de la referencia—. Es el propio vino al 65% mezclado
 * con el fondo, no un gris: en un correo no se puede usar `opacity` con
 * garantías, así que la mezcla va calculada y escrita en firme.
 */
const VINO_CLARO = "#816064";

/** El ancho de siempre en correo: cabe en cualquier panel de lectura. */
const ANCHO = 600;

/**
 * Las tipografías del sitio, con su sustituto detrás.
 *
 * Apple Mail y iOS cargan `@font-face`; Gmail y Outlook no. Así que se
 * declaran las reales primero y detrás la pila más cercana: una serif de alto
 * contraste para los titulares, como Arizona Flare, y la sans del sistema
 * para el texto, como Plus Jakarta. Quien pueda verá la fuente de la marca;
 * quien no, algo que se le parece.
 */
const TITULO = `'ABC Arizona Flare', Georgia, 'Times New Roman', Times, serif`;
const TEXTO = `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;

/**
 * Las fuentes de la marca, declaradas para quien pueda cargarlas.
 *
 * Va en un `<style>` y no en línea porque `@font-face` no admite otra cosa.
 * Gmail y Outlook descartan ese bloque entero y se quedan con la pila de
 * respaldo; Apple Mail e iOS sí lo leen y pintan Arizona Flare y Plus Jakarta
 * de verdad. Los pesos —300 en el texto, 500 en el nombre del artículo— van
 * además en línea, para que la jerarquía se mantenga incluso sin las fuentes.
 */
function caraTipografica(base: string) {
  if (!base) return "";
  return `
  @font-face {
    font-family: 'ABC Arizona Flare';
    src: url('${base}/fonts/ABCArizonaFlare-Light-Trial.otf') format('opentype');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('${base}/fonts/PlusJakartaSans-VariableFont_wght.ttf') format('truetype');
    font-weight: 200 800; font-style: normal; font-display: swap;
  }`;
}

export type Contacto = {
  siteName?: string;
  email?: string;
  phone?: string;
  addressStreet?: string;
  addressFloor?: string;
  addressLocality?: string;
  instagram?: string;
  web?: string;
};

/** Escapa lo que escribe el usuario antes de meterlo en el HTML del correo. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Una fila de datos: rótulo a la izquierda, valor a la derecha.
 *
 * Se omite entera si el valor viene vacío, que es lo que hace que un campo
 * sin rellenar no deje una línea huérfana en el correo.
 */
export function fila(label: string, value?: string | null): string {
  if (!value || !String(value).trim()) return "";
  return `<tr>
    <td class="dato" align="left" width="44%" style="width:44%;padding:0 10px 10px 0;font-family:${TEXTO};font-size:14px;font-weight:300;line-height:1.5;color:${VINO};vertical-align:top;">${esc(label)}</td>
    <td class="dato" align="right" width="56%" style="width:56%;padding:0 0 10px 10px;font-family:${TEXTO};font-size:14px;font-weight:300;line-height:1.5;color:${VINO};vertical-align:top;word-break:break-word;overflow-wrap:break-word;">${esc(value).replace(/\n/g, "<br>")}</td>
  </tr>`;
}

/** La tabla que agrupa las filas. Vacía, no se pinta. */
export function tabla(filas: string): string {
  const contenido = filas.trim();
  if (!contenido) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 8px;">${contenido}</table>`;
}

/** Rótulo de sección: versalitas, con aire generoso encima. */
export function titulo(texto: string): string {
  return `<p class="sec" style="margin:36px 0 18px;font-family:${TITULO};font-size:17px;font-weight:300;line-height:1.35;letter-spacing:0.05em;text-transform:uppercase;color:${VINO};">${esc(texto)}</p>`;
}

export function parrafo(texto: string): string {
  return `<p class="dato" style="margin:0 0 14px;font-family:${TEXTO};font-size:14px;font-weight:300;line-height:1.65;color:${VINO};">${texto}</p>`;
}

/**
 * Una pieza del listado de artículos: nombre subrayado y, debajo, el detalle
 * en una línea. Es la composición de la referencia.
 */
export function articulo(
  nombre: string,
  url: string,
  detalle: string,
): string {
  return `<div style="margin:0 0 20px;">
    <a href="${esc(url)}" class="prod" style="font-family:${TEXTO};font-size:15px;font-weight:500;line-height:1.4;color:${VINO};text-decoration:underline;word-break:break-word;">${esc(nombre)}</a>
    <div class="det" style="margin-top:7px;font-family:${TEXTO};font-size:13px;font-weight:300;line-height:1.5;color:${VINO_CLARO};">${detalle}</div>
  </div>`;
}

/**
 * El pie. Si hay imagen compuesta, se usa tal cual; si no, se compone con
 * texto sobre el burdeos, respetando el mismo reparto de la referencia:
 * logotipo a la izquierda, datos y distintivo a la derecha.
 */
function pie(c: Contacto): string {
  const direccion = [c.addressStreet, c.addressFloor].filter(Boolean).join(", ");
  const localidad = c.addressLocality ?? "";

  if (EMAIL_ASSETS.footer) {
    // Dos versiones del mismo pie: la apaisada para el correo a 600px y la
    // vertical para el teléfono. Se pintan las dos y la hoja de estilos
    // esconde la que no toca. Quien descarte el `<style>` —Outlook— se queda
    // con la apaisada, que es la correcta a ese ancho.
    const movil = EMAIL_ASSETS.footerMovil
      ? `<div class="pie-movil" style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
          <img src="${EMAIL_ASSETS.footerMovil}" width="${ANCHO}" alt="Camelia · Interior Design Studio" style="display:block;width:100%;height:auto;border:0;outline:none;text-decoration:none;">
        </div>`
      : "";
    return `<tr>
      <td style="padding:0;background-color:${VINO};" bgcolor="${VINO}">
        <div class="pie-ancho">
          <img src="${EMAIL_ASSETS.footer}" width="${ANCHO}" alt="Camelia · Interior Design Studio" style="display:block;width:100%;max-width:${ANCHO}px;height:auto;border:0;outline:none;text-decoration:none;">
        </div>
        ${movil}
      </td>
    </tr>`;
  }

  // Respaldo en texto, para cuando la imagen del pie todavía no está subida.
  return `<tr>
    <td style="padding:36px 40px;background-color:${VINO};" bgcolor="${VINO}">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">
        <tr>
          <td align="left" style="font-family:${TITULO};font-size:30px;line-height:1.1;letter-spacing:0.06em;color:${ROJO};">
            ${esc(c.siteName ?? "CAMELIA").toUpperCase()}
            <div style="margin-top:8px;font-family:${TEXTO};font-size:9px;letter-spacing:0.14em;line-height:1.4;color:${ROJO};">INTERIOR DESIGN<br>STUDIO</div>
          </td>
          <td align="right" style="font-family:${TEXTO};font-size:11px;line-height:1.6;letter-spacing:0.06em;color:${ROJO};">
            ${c.instagram ? `INSTAGRAM<br>${esc(c.instagram)}<br><br>` : ""}
            ${c.phone ? `${esc(c.phone)}<br>` : ""}
            ${c.web ? esc(c.web) : ""}
          </td>
        </tr>
        <tr>
          <td colspan="2" align="center" style="padding-top:28px;font-family:${TEXTO};font-size:11px;letter-spacing:0.06em;line-height:1.6;color:${ROJO};">
            ${esc(direccion).toUpperCase()}${direccion && localidad ? " &nbsp;&nbsp; " : ""}${esc(localidad).toUpperCase()}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/**
 * Monta el correo entero.
 *
 * Tres capas: burdeos sólido siempre (la que nunca falla), el patrón encima
 * para los clientes que pintan fondos, y el bloque crema centrado sobre los
 * dos. Si el patrón no carga —o el cliente lo ignora— queda el burdeos y la
 * composición se sostiene igual.
 */
export function envoltorio({
  preheader,
  titular,
  referenciaLabel,
  referencia,
  cuerpo,
  contacto,
}: {
  preheader: string;
  titular: string;
  referenciaLabel: string;
  referencia?: string;
  cuerpo: string;
  contacto: Contacto;
}): string {
  const patron = EMAIL_ASSETS.patron;
  // Outlook de escritorio no pinta `background-image` en una celda: necesita
  // VML. Va en comentario condicional para que ningún otro cliente lo vea.
  const vml = patron
    ? `<!--[if gte mso 9]>
    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:100%;">
      <v:fill type="tile" src="${patron}" color="${VINO}" />
      <v:textbox inset="0,0,0,0"><![endif]-->`
    : "";
  const vmlCierre = patron ? `<!--[if gte mso 9]></v:textbox></v:rect><![endif]-->` : "";

  return `<!doctype html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(titular)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
  ${caraTipografica(BASE_ASSETS)}
  /* Solo lo que Gmail descarta sin consecuencias: lo esencial va en línea. */
  /* 520 y no 600: el propio correo mide 600, así que un punto de ruptura por
     encima de esa cifra aplicaría la escala de móvil también en escritorio.
     Por debajo de 520 ya no hay panel de lectura, hay teléfono. */
  @media only screen and (max-width:520px) {
    /* Mismos saltos que en escritorio —titular/sección 1,73 y
       sección/cuerpo 1,15—, un escalón más abajo. Encoge la escala, no la
       jerarquía. */
    .marco   { padding:22px 16px !important; }
    .bloque  { padding:30px 22px !important; }
    .titular { font-size:26px !important; }
    .sec     { font-size:15px !important; margin-top:30px !important; }
    .dato    { font-size:13px !important; }
    .prod    { font-size:14px !important; }
    .det     { font-size:12px !important; }
    .ref     { font-size:11px !important; }
    .pie-ancho { display:none !important; max-height:0 !important; overflow:hidden !important; }
    .pie-movil { display:block !important; max-height:none !important; overflow:visible !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${VINO};">
  <!-- Línea de vista previa de la bandeja. Oculta en el cuerpo, pero los
       clientes la leen; sin ella se enseña el primer trozo de markup. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}</div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;background-color:${VINO};"${patron ? ` background="${patron}"` : ""} bgcolor="${VINO}">
    <tr>
      <td align="center" class="marco" style="padding:40px 16px;background-color:${VINO};${patron ? `background-image:url('${patron}');background-repeat:repeat;` : ""}" bgcolor="${VINO}">
        ${vml}
        <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${ANCHO}"><tr><td><![endif]-->
        <!-- Ancho fluido con tope: a 600px de pantalla o menos el bloque se
             encoge en vez de cortarse. Outlook no entiende max-width, así que
             se le da la tabla fantasma de arriba, que sí le fija los 600. -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:${ANCHO}px;border-collapse:collapse;">
          <tr>
            <td class="bloque" style="padding:44px 40px 52px;background-color:${CREMA};" bgcolor="${CREMA}">

              <!-- El número va arriba del todo y a la derecha, en su propia
                   línea; el titular queda debajo con su aire, como en el
                   diseño. No comparten línea base. -->
              ${
                referencia
                  ? `<p class="ref" style="margin:0 0 26px;text-align:right;font-family:${TEXTO};font-size:12px;font-weight:300;letter-spacing:0.03em;line-height:1.4;color:${VINO};">${esc(referenciaLabel)} ${esc(referencia)}</p>`
                  : ""
              }
              <h1 class="titular" style="margin:0;font-family:${TITULO};font-size:30px;font-weight:300;line-height:1.2;letter-spacing:0.005em;color:${VINO};">${esc(titular)}</h1>

              <div style="height:38px;line-height:38px;font-size:0;">&nbsp;</div>
              ${cuerpo}
            </td>
          </tr>
          ${pie(contacto)}
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
        ${vmlCierre}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** La versión en texto plano, para quien no pinta HTML. */
export function textoPlano(
  titular: string,
  referenciaLabel: string,
  referencia: string | undefined,
  bloques: (string | [string, string | undefined | null])[],
  contacto: Contacto,
): string {
  const lineas: string[] = [titular];
  if (referencia) lineas.push(`${referenciaLabel} ${referencia}`);
  lineas.push("");

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
    contacto.siteName ?? "Camelia",
    "Interior Design Studio",
    direccion,
    contacto.phone ?? "",
    contacto.email ?? "",
  );
  return lineas.filter((l) => l !== undefined).join("\n");
}
