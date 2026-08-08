/** One row of the address dropdown. */
export type AddressSuggestion = {
  id: string;
  /** The street line — this is what lands in the input when picked. */
  primary: string;
  /** Postcode, town, province. Shown beneath `primary`, greyed. */
  secondary: string;
};

export type AddressProviderName = "google" | "mapbox" | "photon";

/**
 * Every provider narrows to this one call, so swapping between them is a
 * question of which key is present in the environment — nothing upstream of
 * here knows or cares which service answered.
 */
export type AddressProvider = (
  query: string,
  signal: AbortSignal,
) => Promise<AddressSuggestion[]>;
