import { NextStudio } from "next-sanity/studio";
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

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
