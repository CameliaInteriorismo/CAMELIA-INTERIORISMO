import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import { PRIVACIDAD_SECTIONS } from "@/features/legal/politica-de-privacidad";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de CAMELIA — qué datos personales recopilamos, con qué finalidad los tratamos, durante cuánto tiempo los conservamos y cómo ejercer tus derechos.",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <LegalDocument sections={PRIVACIDAD_SECTIONS} />
    </LegalPage>
  );
}
