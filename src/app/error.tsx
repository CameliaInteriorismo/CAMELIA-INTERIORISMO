"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

// Pantalla de error para cualquier fallo inesperado al pintar una página.
// Mismo criterio que not-found: autónoma, con la cabecera reducida al logo,
// porque no se puede depender de que (site)/layout ni Sanity estén sanos justo
// cuando algo ha fallado. Sin esto, el visitante vería la pantalla de error por
// defecto de Next, en blanco y sin salida.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // El detalle queda en la consola y en los registros de Vercel (por el
    // digest); a la persona solo se le enseña el aviso.
    console.error(error);
  }, [error]);

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
            <h1 className="font-title text-primary text-4xl md:text-5xl">
              Algo ha fallado
            </h1>
            <p className="text-primary/70 mt-block text-sm leading-relaxed">
              No hemos podido cargar esta página. Prueba de nuevo y, si sigue
              pasando, escríbenos a info@cameliainteriorismo.com.
            </p>
            <div className="mt-block flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={reset}
                className="font-title bg-primary text-background inline-flex h-11 items-center justify-center px-8 text-sm tracking-wide whitespace-nowrap transition-opacity hover:opacity-90"
              >
                REINTENTAR
              </button>
              <ButtonLink href="/">VOLVER AL INICIO</ButtonLink>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
