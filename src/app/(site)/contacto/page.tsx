import type { Metadata } from "next";
import { ContactHero } from "@/features/contacto/ContactHero";
import { ContactCards } from "@/features/contacto/ContactCards";
import { StudioMap } from "@/features/contacto/StudioMap";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Camelia — hablemos de tu proyecto. Escríbenos, llámanos o visítanos en nuestro estudio de Alzira.",
};

export default function ContactoPage() {
  return (
    <>
      <ContactHero />
      <ContactCards />
      <StudioMap />
    </>
  );
}
