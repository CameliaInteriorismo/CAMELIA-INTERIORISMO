"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Grid } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, PinIcon } from "@/components/ui/icons";
import { DeliveryModeToggle } from "@/features/carrito/DeliveryModeToggle";
import { useCartStore } from "@/stores/cartStore";

// Real studio address/hours, per Diseño's CONFIRMACIÓN PEDIDO DATOS.png —
// more specific than Footer.tsx's shorter "Alzira, Valencia (España)" line
// (which is out of scope here; flagged separately, not silently changed).
const STUDIO_NAME = "Camelia interiorismo";
const STUDIO_ADDRESS = "Avenida de la Hispanidad, 4";
const STUDIO_LOCALITY = "46600, Alzira, Valencia";
const STUDIO_HOURS = "Horario: L-V de 9:00 a 18:00";
const STUDIO_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${STUDIO_ADDRESS}, ${STUDIO_LOCALITY}`);

const schema = z
  .object({
    name: z.string().trim().min(1, "Campo obligatorio"),
    taxId: z.string().trim().min(1, "Campo obligatorio"),
    email: z.string().trim().min(1, "Campo obligatorio").email("Correo electrónico no válido"),
    phone: z.string().trim().min(1, "Campo obligatorio"),
    deliveryMode: z.enum(["domicilio", "recogida"], {
      error: "Selecciona un método de entrega",
    }),
    address: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    city: z.string().trim().optional(),
    province: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMode !== "domicilio") return;
    (["address", "postalCode", "city", "province"] as const).forEach((key) => {
      if (!data[key]) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obligatorio",
          path: [key],
        });
      }
    });
  });

type FormValues = z.infer<typeof schema>;

const Field = forwardRef<
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

function PickupInfo() {
  return (
    <div className="flex items-start gap-3">
      <PinIcon className="text-primary mt-1 h-4 w-4 shrink-0" />
      <div>
        <p className="text-primary text-base">{STUDIO_NAME}</p>
        <div className="text-primary/75 mt-2 space-y-1 text-sm">
          <p>{STUDIO_ADDRESS}</p>
          <p>{STUDIO_LOCALITY}</p>
          <p>{STUDIO_HOURS}</p>
        </div>
        <a
          href={STUDIO_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-3 inline-flex items-center gap-2 text-sm"
        >
          Cómo llegar
          <ArrowRightIcon className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export function ContactForm() {
  const router = useRouter();
  const setContactInfo = useCartStore((state) => state.setContactInfo);
  const setDeliveryMode = useCartStore((state) => state.setDeliveryMode);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const deliveryMode = watch("deliveryMode");

  function onSubmit(data: FormValues) {
    setContactInfo({
      name: data.name,
      taxId: data.taxId,
      email: data.email,
      phone: data.phone,
      address: data.deliveryMode === "domicilio" ? data.address : undefined,
      postalCode: data.deliveryMode === "domicilio" ? data.postalCode : undefined,
      city: data.deliveryMode === "domicilio" ? data.city : undefined,
      province: data.deliveryMode === "domicilio" ? data.province : undefined,
    });
    setDeliveryMode(data.deliveryMode);
    // Visual flow only for now — the details are kept in the cart store and
    // the user is taken straight to the confirmation screen. Actually
    // submitting the request (persisting it, emailing the studio) and
    // clearing the cart afterwards is deliberately still to be wired up.
    router.push("/carrito/gracias");
  }

  return (
    <section className="pt-title pb-[100px]">
      <Container>
        <h1 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Información de contacto
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-title">
          <Grid>
            <div className="col-span-12 md:col-span-5">
              <h2 className="font-title text-primary text-2xl">
                Datos del pedido
              </h2>

              <div className="mt-block space-y-block">
                <Field
                  label="Nombre y apellidos o empresa"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Field
                  label="DNI/NIE o NIF"
                  error={errors.taxId?.message}
                  {...register("taxId")}
                />
                <Field
                  label="Correo electrónico"
                  type="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Field
                  label="Teléfono"
                  type="tel"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="col-span-12 mt-title md:col-span-6 md:col-start-7 md:mt-0">
              <DeliveryModeToggle
                value={deliveryMode ?? null}
                onChange={(mode) =>
                  setValue("deliveryMode", mode, { shouldValidate: true })
                }
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
                          label="Dirección"
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
                              label="Código postal"
                              error={errors.postalCode?.message}
                              {...register("postalCode")}
                            />
                          </div>
                          <div className="col-span-2">
                            <Field
                              label="Ciudad"
                              error={errors.city?.message}
                              {...register("city")}
                            />
                          </div>
                        </div>
                        <Field
                          label="Provincia"
                          error={errors.province?.message}
                          {...register("province")}
                        />
                        <p className="text-primary/60 text-xs">
                          *Una vez recibamos tu solicitud, calcularemos los
                          gastos de envío y te enviaremos el presupuesto
                          completo.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-block">
                        <PickupInfo />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Grid>

          <Button type="submit" className="mt-title w-full">
            TRAMITAR PEDIDO
          </Button>
        </form>
      </Container>
    </section>
  );
}
