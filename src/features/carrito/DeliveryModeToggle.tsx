import type { DeliveryCopy } from "@/features/carrito/types";
import type { DeliveryMode } from "@/types/cart";

/**
 * Deliberately mirrors ContactForm's `Field` structure — an `h2`, then a
 * label `<p className="mb-2 text-sm">`, then a 44px-tall control row — so
 * this block occupies exactly one field row's height. That's what keeps
 * the two checkout columns on a shared baseline grid: with an identical
 * first row and an identical `space-y-block` rhythm below it, DNI lines up
 * with Dirección, Correo with Código postal/Ciudad, and Teléfono with
 * Provincia without any hand-tuned offsets.
 */
export function DeliveryModeToggle({
  value,
  onChange,
  copy = {},
}: {
  value: DeliveryMode | null;
  onChange: (mode: DeliveryMode) => void;
  copy?: DeliveryCopy;
}) {
  return (
    <div>
      <h2 className="font-title text-primary text-3xl md:text-4xl">
        {copy.title ?? "Método de entrega"}
      </h2>
      <div className="mt-block">
        <p className="text-primary/75 mb-2 text-sm">
          {copy.subtitle ?? "Selecciona cómo prefieres recibir tu pedido"}
        </p>
        <div className="flex h-11 flex-wrap items-center gap-x-8 gap-y-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="deliveryMode"
              checked={value === "domicilio"}
              onChange={() => onChange("domicilio")}
              className="accent-primary h-4 w-4"
            />
            <span className="text-primary text-sm">
              {copy.homeLabel ?? "Entrega a domicilio"}
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="deliveryMode"
              checked={value === "recogida"}
              onChange={() => onChange("recogida")}
              className="accent-primary h-4 w-4"
            />
            <span className="text-primary text-sm">
              {copy.pickupLabel ?? "Recoger en el estudio"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
