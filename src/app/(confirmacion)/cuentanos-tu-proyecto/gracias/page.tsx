import type { Metadata } from "next";
import { FormSent } from "@/features/formulario/FormSent";

export const metadata: Metadata = {
  title: "Solicitud enviada",
  description: "Camelia — gracias por contactar con nosotras.",
};

export default function FormularioGraciasPage() {
  return <FormSent />;
}
