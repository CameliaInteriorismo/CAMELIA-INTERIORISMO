import "server-only";
import { SITE_URL } from "@/lib/site";
import {
  articulo,
  envoltorio,
  esc,
  fila,
  parrafo,
  tabla,
  textoPlano,
  titulo,
  type Contacto,
} from "@/lib/email/layout";
import {
  conNombre,
  resolver,
  type Plantilla,
} from "@/lib/email/textos";

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

/** Lo que se lee en el correo según lo elegido en el formulario. */
const ENTREGA = {
  domicilio: "Entrega a domicilio",
  recogida: "Recogida en el estudio",
} as const;

/** "Acabado: Roble · Cantidad: 2". El acabado se cae si la pieza no tiene. */
function detalle(item: ArticuloSolicitado) {
  return [
    item.finish ? `Acabado: ${esc(item.finish)}` : "",
    `Cantidad: ${esc(String(item.quantity))}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function articulosHtml(items: ArticuloSolicitado[]) {
  return items
    .map((item) =>
      articulo(
        item.title,
        `${SITE_URL}/tienda/${item.slug}`,
        detalle(item) + (item.notes ? `<br>Nota: ${esc(item.notes)}` : ""),
      ),
    )
    .join("");
}

function articulosTexto(items: ArticuloSolicitado[]) {
  return items
    .map((item) =>
      [
        `- ${item.title}`,
        item.finish ? `  Acabado: ${item.finish}` : "",
        `  Cantidad: ${item.quantity}`,
        item.notes ? `  Nota: ${item.notes}` : "",
        `  ${SITE_URL}/tienda/${item.slug}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
}

/** Confirmación para quien ha solicitado las piezas. */
export function emailCliente(
  s: SolicitudProducto,
  contacto: Contacto,
  textos?: Plantilla,
) {
  const t = resolver("productoCliente", textos);

  const cuerpo = `
    ${t.intro.map((p) => parrafo(esc(conNombre(p, s.name)))).join("")}
    ${titulo(t.seccion(0))}
    ${articulosHtml(s.items)}
    ${titulo(t.seccion(1))}
    ${tabla(
      fila(t.rotulo("entrega"), ENTREGA[s.deliveryMode]) +
        fila(t.rotulo("direccion"), s.address),
    )}
    <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
    ${parrafo(esc(t.outro))}
  `;

  return {
    subject: t.subject,
    html: envoltorio({
      preheader: t.intro[1] ?? t.title,
      titular: t.title,
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      t.title,
      [
        ...t.intro.map((p) => conNombre(p, s.name)),
        t.seccion(0),
        articulosTexto(s.items),
        [t.rotulo("entrega"), ENTREGA[s.deliveryMode]],
        [t.rotulo("direccion"), s.address],
        t.outro,
      ],
      contacto,
    ),
  };
}

/** Aviso para el estudio, con todo lo que ha rellenado el cliente. */
export function emailEstudio(
  s: SolicitudProducto,
  contacto: Contacto,
  textos?: Plantilla,
) {
  const t = resolver("productoEstudio", textos);

  const cuerpo = `
    ${titulo(t.seccion(0))}
    ${tabla(
      fila(t.rotulo("nombre"), s.name) +
        fila(t.rotulo("dni"), s.taxId) +
        fila(t.rotulo("email"), s.email) +
        fila(t.rotulo("telefono"), s.phone),
    )}
    ${titulo(t.seccion(1))}
    ${articulosHtml(s.items)}
    ${titulo(t.seccion(2))}
    ${tabla(
      fila(t.rotulo("modo"), ENTREGA[s.deliveryMode]) +
        fila(t.rotulo("direccion"), s.address) +
        fila(t.rotulo("codigoPostal"), s.postalCode) +
        fila(t.rotulo("localidad"), s.city) +
        fila(t.rotulo("provincia"), s.province),
    )}
    ${titulo(t.seccion(3))}
    ${tabla(fila(t.rotulo("fecha"), s.fecha))}
  `;

  return {
    subject: t.subject,
    html: envoltorio({
      preheader: `${s.name} · ${s.items.length} artículo(s)`,
      titular: t.title,
      cuerpo,
      contacto,
    }),
    text: textoPlano(
      t.title,
      [
        t.seccion(0),
        [t.rotulo("nombre"), s.name],
        [t.rotulo("dni"), s.taxId],
        [t.rotulo("email"), s.email],
        [t.rotulo("telefono"), s.phone],
        t.seccion(1),
        articulosTexto(s.items),
        t.seccion(2),
        [t.rotulo("modo"), ENTREGA[s.deliveryMode]],
        [t.rotulo("direccion"), s.address],
        [t.rotulo("codigoPostal"), s.postalCode],
        [t.rotulo("localidad"), s.city],
        [t.rotulo("provincia"), s.province],
        t.seccion(3),
        [t.rotulo("fecha"), s.fecha],
      ],
      contacto,
    ),
  };
}
