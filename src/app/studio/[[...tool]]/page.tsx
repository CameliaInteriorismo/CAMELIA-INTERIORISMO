import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import { metadata as studioMetadata } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * El panel de Sanity, servido desde la propia web en /studio.
 *
 * `force-static` + `dynamic = "force-static"` no valen aquí: el Studio es una
 * aplicación de cliente que necesita su propia sesión, así que la ruta se
 * queda dinámica. Vive fuera del grupo (site), por lo que no hereda navbar,
 * pie ni tipografías de Camelia.
 */
export const dynamic = "force-dynamic";

export { viewport } from "next-sanity/studio";

/**
 * La metadata del Studio se reexportaba entera desde next-sanity. Se
 * mantiene, y encima se declara que el panel no debe indexarse: hasta ahora
 * era una ruta pública más para un buscador.
 */
export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
