/**
 * Layout mínimo: el Studio trae sus propios estilos y no debe heredar los de
 * Camelia. Solo se le da la altura completa que necesita.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ height: "100dvh" }}>{children}</div>;
}
