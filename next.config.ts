import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is Next's own default, for anything at card size or below.
    //
    // 90 is what the full-bleed hero photography uses. It replaced 100:
    // at 100 a hero came out of the optimiser at 784KB (3840px wide on a
    // retina screen), against 85KB at the default — a nine-fold difference
    // that showed up directly as pages taking a second to settle. 90 keeps
    // the grain and gradients of a hero clean while landing far closer to
    // the small end. Any value not listed here is rejected outright by the
    // optimiser, which is why it has to be declared.
    qualities: [75, 90],
  },
};

export default nextConfig;
