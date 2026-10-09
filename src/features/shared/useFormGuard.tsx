"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Antispam sin fricción para quien rellena: un campo trampa invisible y la
 * hora a la que se abrió el formulario. No pide nada a la persona. El
 * servidor decide qué hacer con ello (ver `revisarGuard`).
 *
 * El campo trampa va con `tabIndex={-1}`, `aria-hidden` y fuera de pantalla
 * —no con `display: none`, que muchos bots detectan—, y con
 * `autoComplete="off"` para que el navegador no lo rellene por su cuenta.
 */
export function useFormGuard() {
  const apertura = useRef(0);
  const trampa = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apertura.current = Date.now();
  }, []);

  const guard = useCallback(
    () => ({ hp: trampa.current?.value ?? "", t: apertura.current }),
    [],
  );

  const campoTrampa = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label>
        No rellenes este campo
        <input
          ref={trampa}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );

  return { guard, campoTrampa };
}
