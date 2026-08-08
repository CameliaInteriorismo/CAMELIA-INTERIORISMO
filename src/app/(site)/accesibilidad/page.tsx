import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import {
  ACCESIBILIDAD_LEAD,
  ACCESIBILIDAD_SECTIONS,
} from "@/features/legal/accesibilidad";

export const metadata: Metadata = {
  title: "Accesibilidad",
  description:
    "Declaración de accesibilidad de CAMELIA — las medidas que aplicamos para que la web sea utilizable por el mayor número de personas, sus limitaciones conocidas y cómo comunicarnos cualquier barrera.",
};

export default function AccesibilidadPage() {
  return (
    <LegalPage title="Accesibilidad web">
      <LegalDocument
        lead={ACCESIBILIDAD_LEAD}
        sections={ACCESIBILIDAD_SECTIONS}
      />
    </LegalPage>
  );
}
