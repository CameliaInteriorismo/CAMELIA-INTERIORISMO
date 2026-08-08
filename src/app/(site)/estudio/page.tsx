import type { Metadata } from "next";
import { AboutSections } from "@/features/estudio/AboutSections";

export const metadata: Metadata = {
  title: "Estudio",
  description:
    "Camelia — estudio de interiorismo en Alzira. Conoce el origen del estudio y su dirección creativa y ejecutiva.",
};

export default function EstudioPage() {
  return <AboutSections />;
}
