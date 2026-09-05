import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

// Next sirve esto para CUALQUIER ruta sin match, así que vive en la raíz y
// no dentro de (site): en ese punto todavía no se sabe qué grupo de rutas
// pisó la persona, y (site)/layout necesita datos de Sanity que aquí no
// tienen dónde llegar. Por eso es una pantalla autónoma, con su propia
// cabecera reducida al logotipo — el mismo criterio que ya usa la pantalla
// de "solicitud enviada" para cerrar un flujo sin la barra completa.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-primary/15 border-b">
        <Container>
          <div className="flex h-20 items-center">
            <Link href="/" aria-label="Camelia — inicio">
              <Image
                src="/images/logos/trimmed/Camelia logo sin fondo vino actualizado.png"
                alt="Camelia"
                width={828}
                height={130}
                priority
                className="h-5 w-auto"
              />
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-section flex flex-1 items-center justify-center">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <p className="font-title text-primary text-6xl md:text-7xl">
              404
            </p>
            <p className="text-primary/70 mt-block text-sm leading-relaxed">
              No hemos encontrado esta página. Puede que se haya movido o que
              la dirección tenga un error.
            </p>
            <ButtonLink href="/" className="mt-block">
              VOLVER AL INICIO
            </ButtonLink>
          </div>
        </Container>
      </main>
    </div>
  );
}
