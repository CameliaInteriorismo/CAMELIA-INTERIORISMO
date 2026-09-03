"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Grid } from "@/components/layout/Container";
import { ArrowRightIcon, PinIcon } from "@/components/ui/icons";
import { DeliveryModeToggle } from "@/features/carrito/DeliveryModeToggle";
import type { ConfirmationCopy } from "@/features/carrito/types";
import type { ContactDetails } from "@/features/contacto/types";
import type { DeliveryMode } from "@/types/cart";

/**
 * La forma exacta del esquema de Zod de `ContactForm` (name, taxId, email,
 * phone, deliveryMode y los cuatro campos de dirección, obligatorios solo
 * si se entrega a domicilio). Declarada aquí, no importada de allí, para
 * que este módulo y `OrderReview` puedan usarla sin que ninguno de los dos
 * dependa del otro — `ContactForm` sigue siendo quien valida de verdad; si
 * su esquema cambia de forma, TypeScript avisa en el `useForm<FormValues>`
 * de ese archivo porque deja de encajar con este tipo.
 */
export type DatosFormValues = {
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

export const Field = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
>(function Field({ label, error, ...props }, ref) {
  return (
    <div>
      <p className="text-primary mb-2 text-sm">{label}</p>
      <input
        ref={ref}
        {...props}
        className="border-primary/30 text-primary h-11 w-full border px-4 text-sm"
      />
      {error && <p className="text-secondary mt-2 text-xs">{error}</p>}
    </div>
  );
});

/**
 * El bloque que aparece al elegir "Recoger en el estudio".
 *
 * La dirección NO se escribe aquí ni en la página de confirmación: sale de
 * los ajustes globales, los mismos que pintan el pie y /contacto. Así el
 * estudio tiene una sola dirección en todo el sitio y no hay forma de que
 * dos copias se queden distintas.
 *
 * "Cómo llegar" acepta un destino propio en Sanity por si algún día apunta a
 * otro sitio; vacío, cae en el enlace de Maps que ya se calcula a partir de
 * esa misma dirección.
 */
function PickupInfo({
  copy,
  contact,
}: {
  copy: ConfirmationCopy;
  contact: ContactDetails;
}) {
  const directions = copy.studioDirections;
  return (
    <div className="flex items-start gap-3">
      <PinIcon className="text-primary mt-1 h-4 w-4 shrink-0" />
      <div>
        <p className="text-primary text-base">{copy.studioName}</p>
        <div className="text-primary/75 mt-2 space-y-1 text-sm">
          {contact.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>{copy.studioHours}</p>
        </div>
        {copy.studioNote && (
          <p className="text-primary/75 mt-2 text-sm">{copy.studioNote}</p>
        )}
        <a
          href={directions?.href || contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-3 inline-flex items-center gap-2 text-sm"
        >
          {directions?.label ?? "Cómo llegar"}
          <ArrowRightIcon className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/**
 * Los campos de contacto y entrega, sin el título de la página ni el botón
 * final — solo la parte que se contesta. Aparte de `ContactForm` para que
 * la revisión del pedido pueda reutilizarla tal cual al editar en el sitio:
 * mismo campo, mismo `register`, mismos errores — sin un segundo formulario
 * que pueda desincronizarse del primero.
 */
export function CamposEntrega({
  register,
  errors,
  labels = {},
  deliveryMode,
  onChangeDeliveryMode,
  copy,
  contact,
}: {
  register: UseFormRegister<DatosFormValues>;
  errors: FieldErrors<DatosFormValues>;
  labels?: ConfirmationCopy["fieldLabels"];
  deliveryMode?: DeliveryMode;
  onChangeDeliveryMode: (mode: DeliveryMode) => void;
  copy: ConfirmationCopy;
  contact: ContactDetails;
}) {
  return (
    <Grid>
      <div className="col-span-12 md:col-span-5">
        <h2 className="font-title text-primary text-3xl md:text-4xl">
          {copy.orderDataTitle ?? "Datos del pedido"}
        </h2>

        <div className="mt-block space-y-block">
          <Field
            label={labels.name ?? "Nombre y apellidos o empresa"}
            error={errors.name?.message}
            {...register("name")}
          />
          <Field
            label={labels.taxId ?? "DNI/NIE o NIF"}
            error={errors.taxId?.message}
            {...register("taxId")}
          />
          <Field
            label={labels.email ?? "Correo electrónico"}
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Field
            label={labels.phone ?? "Teléfono"}
            type="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      <div className="mt-block col-span-12 md:col-span-6 md:col-start-7 md:mt-0">
        <DeliveryModeToggle
          value={deliveryMode ?? null}
          onChange={onChangeDeliveryMode}
          copy={copy.delivery}
        />
        {errors.deliveryMode && (
          <p className="text-secondary mt-2 text-xs">
            {errors.deliveryMode.message}
          </p>
        )}

        {/* A single motion.div keyed by deliveryMode — not two
            separately-conditioned siblings — so AnimatePresence's
            mode="wait" tracks exactly one child mounting/unmounting
            at a time. Two independent `condition && <motion.div key=.../>`
            siblings swap array positions on toggle, which confuses
            its exit/enter matching and left both blocks (or neither)
            visible when switching modes. */}
        <AnimatePresence mode="wait" initial={false}>
          {deliveryMode && (
            <motion.div
              key={deliveryMode}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              {deliveryMode === "domicilio" ? (
                // Same `mt-block space-y-block` rhythm as the left
                // column's field stack, so each row here shares a
                // baseline with its counterpart there: Dirección with
                // DNI, Código postal/Ciudad with Correo, Provincia
                // with Teléfono.
                <div className="mt-block space-y-block">
                  <Field
                    label={labels.address ?? "Dirección"}
                    error={errors.address?.message}
                    {...register("address")}
                  />
                  {/* 1:2 split — the narrower postcode box beside a
                      wider city box, per the reference. Both are one
                      field row tall, so the pair still counts as a
                      single row in the shared grid. */}
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1">
                      <Field
                        label={labels.postalCode ?? "Código postal"}
                        error={errors.postalCode?.message}
                        {...register("postalCode")}
                      />
                    </div>
                    <div className="col-span-2">
                      <Field
                        label={labels.city ?? "Ciudad"}
                        error={errors.city?.message}
                        {...register("city")}
                      />
                    </div>
                  </div>
                  <Field
                    label={labels.province ?? "Provincia"}
                    error={errors.province?.message}
                    {...register("province")}
                  />
                  <p className="text-primary/60 text-xs">
                    {copy.shippingNote ??
                      "*Una vez recibamos tu solicitud, calcularemos los gastos de envío y te enviaremos el presupuesto completo."}
                  </p>
                </div>
              ) : (
                <div className="mt-block">
                  <PickupInfo copy={copy} contact={contact} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Grid>
  );
}
