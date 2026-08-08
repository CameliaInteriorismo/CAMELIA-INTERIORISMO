import { create } from "zustand";

/**
 * Bridges the Home hero (deep in the page tree) and the Navbar (rendered by
 * the layout above it): whether the hero's travelling wordmark has finished
 * its trip into the navbar slot, and whether the hero is still the section
 * in view (drives the experimental transparent-navbar-over-hero treatment).
 * Not part of cartStore — this is transient scroll UI, not business state.
 */
interface HeroState {
  logoRevealed: boolean;
  setLogoRevealed: (value: boolean) => void;
  heroActive: boolean;
  setHeroActive: (value: boolean) => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  logoRevealed: false,
  setLogoRevealed: (logoRevealed) => set({ logoRevealed }),
  heroActive: true,
  setHeroActive: (heroActive) => set({ heroActive }),
}));
