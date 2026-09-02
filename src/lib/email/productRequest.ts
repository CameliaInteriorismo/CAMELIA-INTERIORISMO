import "server-only";
import { SITE_URL } from "@/lib/site";
import {
  envoltorio,
  esc,
  fila,
  parrafo,
  tabla,
  textoPlano,
  titulo,
  type Contacto,
} from "@/lib/email/layout";

export type ArticuloSolicitado = {
  title: string;
  slug: string;
  finish?: string;
  quantity: number;
  notes?: string;
};

export type SolicitudProducto = {
  fecha: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  deliveryMode: "domicilio" | "recogida";
  address?: string;
  postalCode?: string;
  city?: string;
  province?: string;
  items: ArticuloSolicitado[];
};

const ENTREGA = {
  domicilio: "Entrega a domicilio",
  recogida: "Recogida en el estudio",
} as const;

/** El listado de piezas, en HTML y en texto, para no repetirlo dos veces. */
function articulosHtml(items: ArticuloSolicitado[]) {
  return items
    .map((item) => {
      const url = `${SITE_URL}/tienda/${item.slug}`;
      const detalles = [
        item.finish ? `Acabado: ${item.finish}` : "",
        `Cantidad: ${item.quantity}`,
      ]
        .filter(Boolean)
        .join(" &nbsp;·&nbsp; ");
      return `<div style="padding:16px 0;border-bottom:1px solid #e6ddcc;">
        <a href="${esc(url)}" style="color:#3f0e1a;font-size:15px;text-decoration:underline;">${esc(item.title)}</a>
        <div style="margin-top:6px;color:#3f0e1a;opacity:.65;font-size:13px;">${detalles}</div>
        ${item.notes ? `<div style="margin-top:6px;color:#3f0e1a;opacity:.65;font-size:13px;">Nota: ${esc(item.notes)}</div>` : ""}
      </div>`;
    })
    .join("");
}

function articulosTexto(items: ArticuloSolicitado[]) {
  return items
    .map((item) => {
      const partes = [
        `- ${item.title}`,
        item.finish ? `  Acabado: ${item.finish}` : "",
        `  Cantidad: ${item.quantity}`,
        item.notes ? `  Nota: ${item.notes}` : "",
        `  ${SITE_URL}/tienda/${item.slug}`,
      ];
      return partes.filter(Boolean).join("\n");
    })
    .join("\n");
}

/** Confirmación para quien ha solicitado las piezas. */
export function emailCliente(s: SolicitudProducto, contacto: Contacto) {
  const subject = "Hemos recibido tu solicitud · Camelia Interiorismo";
  const cuerpo = `
    ${parrafo(`Hola ${esc(s.name)}, gracias por escribirnos.`)}
    ${parrafo("Hemos recibido tu solicitud y la estamos revisando. Te contactaremos en breve para confirmarte disponibilidad y plazos.")}
    ${titulo("Lo que has solicitado")}
    ${articulosHtml(s.items)}
    ${titulo("Cómo lo recibirás")}
    ${tabla(fila("Entrega", ENTREGA[s.deliveryMode]))}
    ${parrafo("Si necesitas cambiar algo, respóndenos a este mismo correo.")}
  `;

  return {
    subject,
    html: envoltorio({
      preheader: "Hemos recibido tu solicitud y la estamos revisando.",
      encabezado: "Solicitud recibida",
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      "Solicitud recibida",
      [
        `Hola ${s.name}, gracias por escribirnos.`,
        "Hemos recibido tu solicitud y la estamos revisando. Te contactaremos en breve para confirmarte disponibilidad y plazos.",
        "LO QUE HAS SOLICITADO",
        articulosTexto(s.items),
        ["Entrega", ENTREGA[s.deliveryMode]],
        "Si necesitas cambiar algo, respóndenos a este mismo correo.",
      ],
      contacto,
    ),
  };
}

/** Aviso para el estudio, con todo lo que ha rellenado el cliente. */
export function emailEstudio(s: SolicitudProducto, contacto: Contacto) {
  const subject = `Nueva solicitud de artículo · ${s.name}`;
  const cuerpo = `
    ${titulo("Cliente")}
    ${tabla(
      fila("Nombre", s.name) +
        fila("DNI / NIF", s.taxId) +
        fila("Email", s.email) +
        fila("Teléfono", s.phone),
    )}
    ${titulo("Artículos")}
    ${articulosHtml(s.items)}
    ${titulo("Entrega")}
    ${tabla(
      fila("Modo", ENTREGA[s.deliveryMode]) +
        fila("Dirección", s.address) +
        fila("Código postal", s.postalCode) +
        fila("Localidad", s.city) +
        fila("Provincia", s.province),
    )}
    ${titulo("Solicitud")}
    ${tabla(fila("Fecha y hora", s.fecha))}
  `;

  return {
    subject,
    html: envoltorio({
      preheader: `${s.name} ha solicitado ${s.items.length} artículo(s).`,
      encabezado: "Nueva solicitud de artículo",
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      "Nueva solicitud de artículo",
      [
        "CLIENTE",
        ["Nombre", s.name],
        ["DNI / NIF", s.taxId],
        ["Email", s.email],
        ["Teléfono", s.phone],
        "ARTÍCULOS",
        articulosTexto(s.items),
        "ENTREGA",
        ["Modo", ENTREGA[s.deliveryMode]],
        ["Dirección", s.address],
        ["Código postal", s.postalCode],
        ["Localidad", s.city],
        ["Provincia", s.province],
        "SOLICITUD",
        ["Fecha y hora", s.fecha],
      ],
      contacto,
    ),
  };
}
