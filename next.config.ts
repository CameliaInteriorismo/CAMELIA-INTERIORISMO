import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is Next's own default; 100 is for hero/banner photography where
    // we explicitly want maximum quality with no extra compression.
    qualities: [75, 100],
  },
};

export default nextConfig;
