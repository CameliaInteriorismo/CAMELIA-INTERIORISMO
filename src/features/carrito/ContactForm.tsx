"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CamposEntrega, type DatosFormValues } from "@/features/carrito/CamposEntrega";
import { OrderReview } from "@/features/carrito/OrderReview";
import type { ConfirmationCopy } from "@/features/carrito/types";
import type { ContactDetails } from "@/features/contacto/types";
import type { ProductCardData } from "@/features/tienda/types";
import { useCartStore } from "@/stores/cartStore";
import { enviarSolicitudProducto } from "@/lib/requests/actions";

const schema = z
  .object({
    name: z.string().trim().min(1, "Campo obligatorio"),
    taxId: z.string().trim().min(1, "Campo obligatorio"),
    email: z
      .string()
      .trim()
      .min(1, "Campo obligatorio")
      .email("Correo electrónico no válido"),
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

// La forma de este esquema tiene que coincidir con `DatosFormValues`
// (definida en CamposEntrega.tsx, que es quien la usa para pintar los
// campos): si un día cambia una de las dos, TypeScript avisa aquí mismo,
// en el `useForm<FormValues>` de abajo.
type FormValues = DatosFormValues;

export function ContactForm({
  copy = {},
  contact,
  products,
}: {
  copy?: ConfirmationCopy;
  contact: ContactDetails;
  products: ProductCardData[];
}) {
  // Los rótulos son solo texto. Las claves con las que se registra cada
  // campo ("name", "taxId"...) y el esquema de Zod de arriba no se tocan:
  // cambiar un rótulo en Sanity no puede alterar qué se valida ni qué se
  // guarda.
  const labels = copy.fieldLabels ?? {};
  const router = useRouter();
  const setContactInfo = useCartStore((state) => state.setContactInfo);
  const setDeliveryMode = useCartStore((state) => state.setDeliveryMode);
  const clearCart = useCartStore((state) => state.clear);
  const items = useCartStore((state) => state.items);

  // `enviando` hace dos cosas a la vez: apaga el botón —así un doble clic no
  // dispara dos solicitudes, que serían dos números y dos correos— y cambia
  // su rótulo para que se note que algo está pasando.
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string>();
  // Al validar el formulario no se envía todavía: se guardan sus datos aquí
  // y se enseña la revisión. El <form> con sus campos no se desmonta —solo
  // se oculta—, así que si desde la revisión se pulsa "Editar" no hay nada
  // que restaurar: React Hook Form nunca dejó de tener lo que se escribió.
  const [revisando, setRevisando] = useState(false);
  const [datosRevision, setDatosRevision] = useState<FormValues>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const deliveryMode = watch("deliveryMode");

  function pasarARevision(data: FormValues) {
    setDatosRevision(data);
    setRevisando(true);
  }

  /**
   * Revalida con el mismo resolver de siempre: si algo no pasa (un email mal
   * escrito, un campo de dirección vacío), React Hook Form pinta el error
   * bajo ese campo, igual que en el formulario normal, y se avisa a la
   * revisión de que no cierre la edición. Si todo pasa, se refresca el
   * resumen y se avisa de que sí puede cerrarla.
   */
  async function guardarEdicionDatos(): Promise<boolean> {
    let ok = false;
    await handleSubmit((data) => {
      setDatosRevision(data);
      ok = true;
    })();
    return ok;
  }

  async function confirmarPedido() {
    if (enviando || !datosRevision) return;
    const data = datosRevision;
    setEnviando(true);
    setErrorEnvio(undefined);

    // El envío va PRIMERO. Solo si los correos han salido se vacía el
    // carrito y se pasa a la pantalla de gracias: si Resend falla, la
    // persona se queda en la revisión con sus datos y su carrito intactos,
    // y puede reintentar. Mostrar "enviado" sin haber enviado sería perder
    // la solicitud sin que nadie se entere.
    const resultado = await enviarSolicitudProducto({
      name: data.name,
      taxId: data.taxId,
      email: data.email,
      phone: data.phone,
      deliveryMode: data.deliveryMode,
      address: data.deliveryMode === "domicilio" ? data.address : undefined,
      postalCode:
        data.deliveryMode === "domicilio" ? data.postalCode : undefined,
      city: data.deliveryMode === "domicilio" ? data.city : undefined,
      province: data.deliveryMode === "domicilio" ? data.province : undefined,
      items: items.map((item) => ({
        title: item.title,
        slug: item.slug,
        finish: item.finish,
        quantity: item.quantity,
        notes: item.notes,
      })),
    });

    if (!resultado.ok) {
      setErrorEnvio(resultado.error);
      setEnviando(false);
      return;
    }

    setContactInfo({
      name: data.name,
      taxId: data.taxId,
      email: data.email,
      phone: data.phone,
      address: data.deliveryMode === "domicilio" ? data.address : undefined,
      postalCode:
        data.deliveryMode === "domicilio" ? data.postalCode : undefined,
      city: data.deliveryMode === "domicilio" ? data.city : undefined,
      province: data.deliveryMode === "domicilio" ? data.province : undefined,
    });
    setDeliveryMode(data.deliveryMode);
    // Enviada la solicitud, el carrito se vacía: la pantalla de gracias ya
    // no corresponde a un pedido pendiente, así que el contador del icono
    // debe apagarse en el acto y seguir apagado al recargar o al volver a
    // cualquier página. Se vacía DESPUÉS de leer los datos de arriba, que ya
    // están guardados fuera del store.
    //
    // Lo que sigue pendiente y es otra cosa: persistir la solicitud y avisar
    // al estudio por correo. Eso no cambia aquí.
    clearCart();
    router.push("/carrito/gracias");
  }

  if (revisando && datosRevision) {
    return (
      <section className="pt-section">
        <Container>
          <OrderReview
            items={items}
            products={products}
            datos={datosRevision}
            enviando={enviando}
            error={errorEnvio}
            shippingNote={copy.shippingNote}
            camposEntrega={
              <CamposEntrega
                register={register}
                errors={errors}
                labels={labels}
                deliveryMode={deliveryMode}
                onChangeDeliveryMode={(mode) =>
                  setValue("deliveryMode", mode, { shouldValidate: true })
                }
                copy={copy}
                contact={contact}
              />
            }
            onGuardarDatos={guardarEdicionDatos}
            onVolver={() => {
              setErrorEnvio(undefined);
              setRevisando(false);
            }}
            onConfirmar={() => void confirmarPedido()}
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-section">
      <Container>
        <h1 className="font-title text-primary text-3xl md:text-4xl">
          {copy.title ?? "Información de contacto"}
        </h1>

        <form
          onSubmit={handleSubmit(pasarARevision)}
          noValidate
          className="mt-block"
        >
          <CamposEntrega
            register={register}
            errors={errors}
            labels={labels}
            deliveryMode={deliveryMode}
            onChangeDeliveryMode={(mode) =>
              setValue("deliveryMode", mode, { shouldValidate: true })
            }
            copy={copy}
            contact={contact}
          />

          <Button type="submit" className="mt-block w-full">
            {copy.submitLabel ?? "REVISAR PEDIDO"}
          </Button>
        </form>
      </Container>
    </section>
  );
}
