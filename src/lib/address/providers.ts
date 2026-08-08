import type {
  AddressProvider,
  AddressProviderName,
  AddressSuggestion,
} from "@/lib/address/types";

/**
 * Results are biased to Spain and Spanish. Both are one-line changes if the
 * studio ever takes work abroad; kept here rather than scattered per
 * provider so they can't drift apart.
 */
const COUNTRY = "es";
const LANGUAGE = "es";
const LIMIT = 6;

function joinParts(...parts: (string | undefined | null)[]) {
  return parts.filter(Boolean).join(", ");
}

// --- Google Places (New) --------------------------------------------------
// https://places.googleapis.com/v1/places:autocomplete
// Billed per session; the key stays server-side, which is also why this runs
// through our own route handler rather than the browser SDK.

type GooglePrediction = {
  placePrediction?: {
    placeId?: string;
    text?: { text?: string };
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
};

const googleProvider =
  (apiKey: string): AddressProvider =>
  async (query, signal) => {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          input: query,
          languageCode: LANGUAGE,
          includedRegionCodes: [COUNTRY],
        }),
      },
    );
    if (!res.ok) throw new Error(`Google Places responded ${res.status}`);

    const data: { suggestions?: GooglePrediction[] } = await res.json();
    return (data.suggestions ?? [])
      .slice(0, LIMIT)
      .map((suggestion, index): AddressSuggestion | null => {
        const prediction = suggestion.placePrediction;
        if (!prediction) return null;
        const structured = prediction.structuredFormat;
        const primary =
          structured?.mainText?.text ?? prediction.text?.text ?? "";
        if (!primary) return null;
        return {
          id: prediction.placeId ?? `google-${index}`,
          primary,
          secondary: structured?.secondaryText?.text ?? "",
        };
      })
      .filter((item): item is AddressSuggestion => item !== null);
  };

// --- Mapbox Geocoding v6 --------------------------------------------------
// The Search Box API would need a session token round-tripped from the
// client; forward geocoding with `autocomplete=true` gives the same
// type-ahead behaviour with nothing to keep in sync.

type MapboxFeature = {
  id?: string;
  properties?: {
    name?: string;
    place_formatted?: string;
    full_address?: string;
  };
};

const mapboxProvider =
  (token: string): AddressProvider =>
  async (query, signal) => {
    const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
    url.searchParams.set("q", query);
    url.searchParams.set("autocomplete", "true");
    url.searchParams.set("country", COUNTRY);
    url.searchParams.set("language", LANGUAGE);
    url.searchParams.set("limit", String(LIMIT));
    url.searchParams.set("access_token", token);

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Mapbox responded ${res.status}`);

    const data: { features?: MapboxFeature[] } = await res.json();
    return (data.features ?? [])
      .map((feature, index): AddressSuggestion | null => {
        const primary = feature.properties?.name;
        if (!primary) return null;
        return {
          id: feature.id ?? `mapbox-${index}`,
          primary,
          secondary: feature.properties?.place_formatted ?? "",
        };
      })
      .filter((item): item is AddressSuggestion => item !== null);
  };

// --- Photon (Komoot, OpenStreetMap data) ---------------------------------
// The keyless default, so the field returns real addresses out of the box
// instead of sitting inert until someone buys a key. Photon rather than
// Nominatim because it is built for type-ahead specifically: Nominatim's
// /search matches whole words, so "Calle Colon Valen" returns nothing at
// all and the dropdown blinks out mid-word. Photon prefix-matches.
//
// It has no country parameter, hence the filter below, and its public
// instance offers no uptime guarantee — fine for a contact form, but this
// is the provider to move off before launch.

/** Biases ranking toward the studio's own region. Roughly Valencia city. */
const BIAS_LAT = 39.47;
const BIAS_LON = -0.38;
/** Over-fetch, because the Spain filter runs after the API's own limit. */
const PHOTON_LIMIT = 15;
const SPAIN = new Set(["España", "Spain"]);

type PhotonFeature = {
  properties?: {
    osm_id?: number;
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

const photonProvider: AddressProvider = async (query, signal) => {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(PHOTON_LIMIT));
  url.searchParams.set("lat", String(BIAS_LAT));
  url.searchParams.set("lon", String(BIAS_LON));
  for (const layer of ["house", "street", "locality"]) {
    url.searchParams.append("layer", layer);
  }

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Photon responded ${res.status}`);

  const data: { features?: PhotonFeature[] } = await res.json();
  return (data.features ?? [])
    .map((feature, index): AddressSuggestion | null => {
      const place = feature.properties;
      if (!place || !SPAIN.has(place.country ?? "")) return null;

      const primary = place.housenumber
        ? joinParts(place.street ?? place.name, place.housenumber)
        : (place.name ?? place.street ?? "");
      if (!primary) return null;

      return {
        id: String(place.osm_id ?? `photon-${index}`),
        primary,
        secondary: joinParts(
          place.postcode,
          place.city ?? place.district ?? place.county,
          place.state,
        ),
      };
    })
    .filter((item): item is AddressSuggestion => item !== null)
    .slice(0, LIMIT);
};

/**
 * Picks the provider from whichever key the environment supplies, most
 * capable first. Adding `GOOGLE_PLACES_API_KEY` or `MAPBOX_ACCESS_TOKEN` to
 * the environment is the whole switch-over — no code change, no redeploy of
 * anything but the env.
 */
export function resolveAddressProvider(): {
  name: AddressProviderName;
  search: AddressProvider;
} {
  const googleKey = process.env.GOOGLE_PLACES_API_KEY;
  if (googleKey) return { name: "google", search: googleProvider(googleKey) };

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (mapboxToken)
    return { name: "mapbox", search: mapboxProvider(mapboxToken) };

  return { name: "photon", search: photonProvider };
}
