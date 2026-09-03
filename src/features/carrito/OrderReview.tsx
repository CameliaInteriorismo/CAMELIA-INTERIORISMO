"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { ProductCardData } from "@/features/tienda/types";
import { useCartStore } from "@/stores/cartStore";
import type { CartItem, DeliveryMode } from "@/types/cart";
import { formatPrice } from "@/utils/formatPrice";

/** Los datos ya validados en el formulario, a la espera de confirmación. */
export type DatosPedido = {
  name: string;
  taxId: string;
  email: string;
  phone: string;
  deliveryMode: DeliveryMode;
  address?: string;
  postalCode?: string;
  city?: string;
  province?: string;
};

const ENTREGA: Record<DeliveryMode, string> = {
  domicilio: "Entrega a domicilio",
  recogida: "Recogida en el estudio",
};

/**
 * Una línea del pedido en revisión. Cantidad y observaciones se editan aquí
 * mismo, contra el propio carrito —el mismo store que usa `/carrito`—, en
 * vez de mandar a otra pantalla: así no hace falta ida y vuelta para tocar
 * un dato, y el resto del pedido nunca se toca.
 *
 * Mismo lenguaje que `CartLineItem` (Cantidad y Observaciones lado a lado,
 * la segunda estirándose hasta el margen), pero con la foto más pequeña
 * —esto es un resumen antes de confirmar, no la pantalla de editar el
 * carrito— y con el acabado a la vista, que `CartLineItem` no muestra pero
 * aquí sí importa: es un dato real de la línea, no algo que ya se vio antes.
 */
function LineaPedido({
  item,
  product,
}: {
  item: CartItem;
  product?: ProductCardData;
}) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateNotes = useCartStore((state) => state.updateNotes);

  return (
    <Grid className="border-primary/15 border-t py-block first:border-t-0 first:pt-0">
      {/* Apilada en móvil, como CartLineItem: a los 4/12 de antes, la fila
          de Cantidad/Observaciones quedaba compartiendo columna con la foto
          en una franja de apenas ~200px, y el `min-w-64` de Observaciones
          (256px) no cabía ahí ni pudiendo envolver — un solo elemento por
          debajo de su ancho mínimo no envuelve, se sale. Con la foto a
          ancho completo en móvil, esa fila pasa a tener toda la anchura de
          la página para repartir. */}
      <div className="col-span-12 md:col-span-3">
        <div className="relative aspect-square w-full max-w-48 overflow-hidden md:max-w-none">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 20vw, 192px"
            />
          ) : (
            <PlaceholderImage
              aspectRatio="1 / 1"
              label={`${item.title} — sin foto`}
              className="w-full"
            />
          )}
        </div>
      </div>

      <div className="mt-sm col-span-12 md:col-span-8 md:col-start-5 md:mt-0 md:flex md:flex-col md:justify-center">
        <p className="font-title text-primary text-xl md:text-2xl">
          {item.title}
        </p>
        {/* Pegado al nombre a propósito: son el mismo dato leído en dos
            líneas, no dos datos distintos — el hueco grande va después,
            antes de cantidad/observaciones. */}
        {item.finish && (
          <p className="text-primary/70 mt-1 text-sm">{item.finish}</p>
        )}
        {product?.price !== undefined && (
          <p className="text-primary mt-1 text-sm">
            {formatPrice(product.price * item.quantity)}{" "}
            <span className="text-primary/60 text-xs italic">
              IVA incluido
            </span>
          </p>
        )}

        <div className="mt-block flex flex-wrap items-start gap-10">
          <div>
            <p className="text-primary mb-2 text-sm">Cantidad</p>
            <QuantityStepper
              value={item.quantity}
              min={0}
              onChange={(quantity) => updateQuantity(item.id, quantity)}
            />
          </div>
          <div className="min-w-64 flex-1">
            <p className="text-primary mb-2 text-sm">Observaciones</p>
            <input
              type="text"
              value={item.notes ?? ""}
              onChange={(event) => updateNotes(item.id, event.target.value)}
              placeholder="Texto"
              className="border-primary/30 text-primary placeholder:text-primary/40 h-11 w-full border px-4 text-sm"
            />
          </div>
        </div>
      </div>
    </Grid>
  );
}

export function OrderReview({
  items,
  products,
  datos,
  camposEntrega,
  onGuardarDatos,
  onVolver,
  onConfirmar,
  enviando,
  error,
  shippingNote,
}: {
  items: CartItem[];
  products: ProductCardData[];
  datos: DatosPedido;
  /** Los mismos campos del formulario de contacto/entrega, ya montados con
   * su `register` en vivo — se pintan tal cual al editar en el sitio. */
  camposEntrega: ReactNode;
  /**
   * Revalida con el resolver de siempre y refresca `datos` si todo pasa.
   * Devuelve si pasó: solo entonces se cierra la edición y vuelve a verse
   * el resumen — si no, los campos se quedan abiertos con sus errores.
   */
  onGuardarDatos: () => Promise<boolean>;
  onVolver: () => void;
  onConfirmar: () => void;
  enviando: boolean;
  error?: string;
  shippingNote?: string;
}) {
  // Si se está editando, se enseñan los campos de verdad; si no, el resumen
  // ya confirmado. "Guardar" revalida antes de volver a mostrar el resumen,
  // así que nunca se puede ver un dato a medio escribir como si fuera bueno.
  const [editandoDatos, setEditandoDatos] = useState(false);

  const conPrecio = items
    .map((item) => ({
      item,
      product: products.find((p) => p.slug === item.slug),
    }))
    .filter(
      (l): l is { item: CartItem; product: ProductCardData } =>
        l.product?.price !== undefined,
    );
  const subtotal = conPrecio.reduce(
    (suma, { item, product }) => suma + product.price! * item.quantity,
    0,
  );
  // El subtotal solo se enseña si TODAS las líneas tienen precio: sumar solo
  // las que sí lo tienen daría un número que parece el total y no lo es.
  const subtotalCompleto = conPrecio.length === items.length;

  const direccion = [datos.address, datos.postalCode, datos.city, datos.province]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <h1 className="font-title text-primary text-3xl md:text-4xl">
        Revisa tu pedido
      </h1>
      <p className="text-primary/70 mt-sm max-w-[36rem] text-sm leading-relaxed">
        Antes de tramitarlo, comprueba que todo esté como quieres.
      </p>

      <div className="mt-block">
        {items.map((item) => (
          <LineaPedido
            key={item.id}
            item={item}
            product={products.find((p) => p.slug === item.slug)}
          />
        ))}
      </div>

      <div className="border-primary/15 mt-block border-t pt-block">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-title text-primary text-xl">
            Datos de contacto y entrega
          </h2>
          <button
            type="button"
            onClick={async () => {
              if (!editandoDatos) {
                setEditandoDatos(true);
                return;
              }
              const ok = await onGuardarDatos();
              if (ok) setEditandoDatos(false);
            }}
            aria-expanded={editandoDatos}
            aria-label={
              editandoDatos
                ? "Guardar datos de contacto y entrega"
                : "Editar datos de contacto y entrega"
            }
            className="text-primary shrink-0 text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
          >
            {editandoDatos ? "Guardar" : "Editar"}
          </button>
        </div>

        {editandoDatos ? (
          // Los mismos campos del formulario, contra el mismo `register` —
          // no hay un segundo formulario que sincronizar ni una pantalla a
          // la que volver: se edita aquí y "Guardar" revalida antes de
          // cerrar.
          <div className="mt-sm">{camposEntrega}</div>
        ) : (
          <div className="mt-sm grid grid-cols-1 gap-x-10 gap-y-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-primary/60 text-xs tracking-[0.02em]">
                Nombre y apellidos o empresa
              </p>
              <p className="text-primary mt-1 text-sm">{datos.name}</p>
            </div>
            <div>
              <p className="text-primary/60 text-xs tracking-[0.02em]">
                DNI/NIE o NIF
              </p>
              <p className="text-primary mt-1 text-sm">{datos.taxId}</p>
            </div>
            <div>
              <p className="text-primary/60 text-xs tracking-[0.02em]">
                Correo electrónico
              </p>
              <p className="text-primary mt-1 text-sm break-words">
                {datos.email}
              </p>
            </div>
            <div>
              <p className="text-primary/60 text-xs tracking-[0.02em]">
                Teléfono
              </p>
              <p className="text-primary mt-1 text-sm">{datos.phone}</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-primary/60 text-xs tracking-[0.02em]">
                Entrega
              </p>
              <p className="text-primary mt-1 text-sm">
                {ENTREGA[datos.deliveryMode]}
                {datos.deliveryMode === "domicilio" && direccion
                  ? ` — ${direccion}`
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {subtotalCompleto && (
        <div className="border-primary/15 mt-block border-t pt-block">
          <div className="flex items-baseline justify-between">
            <p className="text-primary text-sm">Subtotal</p>
            <p className="text-primary text-sm">
              {formatPrice(subtotal)}{" "}
              <span className="text-primary/60 text-xs italic">
                IVA incluido
              </span>
            </p>
          </div>
          {datos.deliveryMode === "domicilio" && (
            <p className="text-primary/60 mt-sm text-xs">
              {shippingNote ??
                "*Una vez recibamos tu solicitud, calcularemos los gastos de envío y te enviaremos el presupuesto completo."}
            </p>
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="border-primary/20 text-primary mt-block border p-4 text-sm leading-relaxed"
        >
          {error}
        </p>
      )}

      <div className="mt-block flex items-center justify-end gap-4">
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
          {enviando ? "ENVIANDO…" : "CONFIRMAR PEDIDO"}
        </Button>
      </div>
    </>
  );
}
