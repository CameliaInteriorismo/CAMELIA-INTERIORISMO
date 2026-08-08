import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { LegalDocument } from "@/features/legal/LegalDocument";
import {
  COOKIES_LEAD,
  COOKIES_SECTIONS,
} from "@/features/legal/politica-de-cookies";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies de CAMELIA — qué cookies usamos (técnicas, Google Analytics, Meta Pixel y Google Maps), cómo gestionar tu consentimiento y cómo eliminarlas.",
};

export default function PoliticaDeCookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <LegalDocument lead={COOKIES_LEAD} sections={COOKIES_SECTIONS} />
    </LegalPage>
  );
}
