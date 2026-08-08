import { resolveAddressProvider } from "@/lib/address/providers";
import type { AddressSuggestion } from "@/lib/address/types";

/**
 * Address type-ahead for the project form.
 *
 * The lookup goes through our own server rather than straight from the
 * browser for two reasons: the provider key never reaches the client, and
 * swapping Nominatim for Google or Mapbox later becomes an environment
 * change instead of a rewrite of the component. See src/lib/address.
 *
 * Route Handlers are uncached by default in this version of Next, which is
 * what we want — every keystroke is a fresh query.
 */

/** Below this, the query is too broad to be worth a round trip. */
const MIN_QUERY_LENGTH = 3;

/**
 * Geocoders happily return the same address twice under different internal
 * ids — OpenStreetMap splits a long street into several ways, each its own
 * result. Identical rows in the dropdown look like a bug, so they're folded
 * together on what the user actually reads.
 */
function dedupe(suggestions: AddressSuggestion[]) {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const key = `${suggestion.primary}|${suggestion.secondary}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < MIN_QUERY_LENGTH) {
    return Response.json({ suggestions: [] });
  }

  const { name, search } = resolveAddressProvider();

  try {
    const suggestions = await search(query, request.signal);
    return Response.json({ suggestions: dedupe(suggestions), provider: name });
  } catch (error) {
    // The user aborted (kept typing, navigated away) — not a failure, and
    // there is nobody left to answer.
    if (error instanceof Error && error.name === "AbortError") {
      return new Response(null, { status: 499 });
    }

    console.error(`[direcciones] ${name} lookup failed:`, error);
    return Response.json(
      { suggestions: [], error: "lookup_failed" },
      { status: 502 },
    );
  }
}
