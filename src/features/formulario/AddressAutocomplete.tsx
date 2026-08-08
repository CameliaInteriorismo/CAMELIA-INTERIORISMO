"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fieldClass } from "@/features/formulario/styles";
import type { AddressSuggestion } from "@/lib/address/types";
import { cn } from "@/utils/cn";

/** Matches MIN_QUERY_LENGTH in the route handler — below it, no request. */
const MIN_QUERY_LENGTH = 3;
/**
 * 120ms rather than 300: short enough that the list tracks typing instead of
 * arriving after you've stopped, still long enough to collapse a burst of
 * keystrokes into one request.
 */
const DEBOUNCE_MS = 120;

/**
 * Answers already seen this page view. Backspacing, retyping a street or
 * pausing mid-word all replay a query we've resolved before — serving those
 * from memory makes the list appear instantly and with no network at all.
 * Per-mount and capped, so it can't grow unbounded.
 */
const CACHE_LIMIT = 40;

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
};

export function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  id,
}: Props) {
  const reactId = useId();
  const listboxId = `${id ?? reactId}-listbox`;

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  // Set the moment a suggestion is picked, so the effect below can tell
  // "the user typed this" from "we just wrote this" and not immediately
  // reopen the list under the value it just chose.
  const justPickedRef = useRef(false);
  const cacheRef = useRef(new Map<string, AddressSuggestion[]>());
  const reduceMotion = useReducedMotion();

  const query = value.trim();
  // Too short to be worth asking about. Derived rather than cleared in the
  // effect: a stale list is simply never shown (see `showList` below), which
  // keeps the effect free of the synchronous setState that would otherwise
  // cascade a render on every keystroke.
  const isQueryable = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (justPickedRef.current) {
      justPickedRef.current = false;
      return;
    }
    if (!isQueryable) return;

    // Seen before: show it now, with no debounce and no request at all.
    const cached = cacheRef.current.get(query);
    if (cached) {
      setSuggestions(cached);
      setFailed(false);
      setLoading(false);
      setActiveIndex(-1);
      setOpen(true);
      return;
    }

    const controller = new AbortController();

    // Debounced, and every keystroke aborts the request still in flight —
    // so the list can never be overwritten by a slower, older answer.
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/direcciones?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`Lookup responded ${res.status}`);

        const data: { suggestions?: AddressSuggestion[] } = await res.json();
        const list = data.suggestions ?? [];

        const cache = cacheRef.current;
        if (cache.size >= CACHE_LIMIT) {
          cache.delete(cache.keys().next().value as string);
        }
        cache.set(query, list);

        setSuggestions(list);
        setFailed(false);
        setActiveIndex(-1);
        setOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setSuggestions([]);
        setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isQueryable]);

  // The list scrolls past six rows, so arrowing down has to bring the
  // highlighted row with it or the highlight walks off the bottom edge.
  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${listboxId}-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listboxId]);

  // Clicking anywhere else dismisses the list, the same as any native
  // dropdown. Pointerdown rather than click so it closes before a click
  // elsewhere on the page is dispatched.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function pick(suggestion: AddressSuggestion) {
    justPickedRef.current = true;
    // Full address in the field, not just the street line: the secondary
    // half carries the town and postcode, which is the part the studio
    // actually needs to place the project.
    onChange(
      [suggestion.primary, suggestion.secondary].filter(Boolean).join(", "),
    );
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!open || suggestions.length === 0) {
      // ArrowDown on a field that already has results but a closed list
      // reopens it, which is what the native combobox does.
      if (event.key === "ArrowDown" && suggestions.length > 0) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      // Only swallow Enter when a row is actually highlighted, so the key
      // still advances the step when the user is happy with what they typed.
      event.preventDefault();
      pick(suggestions[activeIndex]);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  // `isQueryable` gates both the list and the status line, so deleting back
  // down to a couple of characters puts the field straight back to rest
  // without a stale list or a stranded "Buscando…" hanging under it.
  const showList = open && isQueryable && suggestions.length > 0;
  const showStatus = isQueryable && (loading || failed);

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (isQueryable && suggestions.length > 0) setOpen(true);
        }}
        placeholder={placeholder}
        // Browser autofill would drop its own dropdown on top of ours.
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        className={cn(fieldClass, "h-11")}
      />

      {/* Status line in place of a spinner: it occupies no layout (absolute)
          and stays quiet, which suits the page better than a moving glyph. */}
      {showStatus && (
        <p
          role="status"
          className="text-primary/45 absolute top-full right-0 mt-2 text-xs"
        >
          {loading ? "Buscando direcciones…" : "Sugerencias no disponibles"}
        </p>
      )}

      <AnimatePresence>
        {showList && (
          <motion.ul
            id={listboxId}
            role="listbox"
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, pointerEvents: "auto" }}
            // `pointerEvents` is set, not tweened: the faded-out list stays
            // mounted for a beat after it closes, and an invisible listbox
            // sitting over ATRÁS/SIGUIENTE would quietly eat the next click.
            exit={{
              opacity: 0,
              pointerEvents: "none",
              ...(reduceMotion ? {} : { y: -4 }),
            }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="bg-background border-primary/25 absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto border"
          >
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id} role="presentation">
                <button
                  type="button"
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  // Keeps focus in the input, so the field never blurs and
                  // the click isn't lost to an outside-click dismissal.
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => pick(suggestion)}
                  className={cn(
                    "block w-full px-4 py-3 text-left transition-colors duration-150",
                    index === activeIndex ? "bg-primary/5" : "bg-transparent",
                  )}
                >
                  <span className="text-primary block text-sm">
                    {suggestion.primary}
                  </span>
                  {suggestion.secondary && (
                    <span className="text-primary/55 mt-0.5 block text-xs">
                      {suggestion.secondary}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
