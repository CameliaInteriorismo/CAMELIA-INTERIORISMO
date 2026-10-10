"use client";

// Último recurso: se pinta cuando falla el propio layout raíz, así que no
// puede usar fuentes, componentes ni estilos de la web (nada de eso existe en
// este punto). Por eso lleva sus estilos en línea, con los colores de marca.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fcf7ec",
          color: "#3f0e1a",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontWeight: 400, fontSize: 36, margin: 0 }}>
            Algo ha fallado
          </h1>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.75,
              margin: "20px 0 28px",
            }}
          >
            No hemos podido cargar la web. Prueba de nuevo y, si sigue pasando,
            escríbenos a info@cameliainteriorismo.com.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#3f0e1a",
              color: "#fcf7ec",
              border: 0,
              height: 44,
              padding: "0 32px",
              fontSize: 14,
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            REINTENTAR
          </button>
        </div>
      </body>
    </html>
  );
}
