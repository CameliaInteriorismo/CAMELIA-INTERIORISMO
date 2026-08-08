import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import { AVISO_LEGAL_SECTIONS } from "@/features/legal/aviso-legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal de CAMELIA — titularidad del sitio web, condiciones de acceso y uso, propiedad intelectual y legislación aplicable.",
};

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <LegalDocument sections={AVISO_LEGAL_SECTIONS} />
    </LegalPage>
  );
}
