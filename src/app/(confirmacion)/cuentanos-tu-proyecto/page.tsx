import type { Metadata } from "next";
import { ProjectForm } from "@/features/formulario/ProjectForm";

export const metadata: Metadata = {
  title: "Cuéntanos tu proyecto",
  description:
    "Camelia — cuéntanos qué tienes en mente y te ayudamos a darle forma.",
};

export default function CuentanosTuProyectoPage() {
  return <ProjectForm />;
}
