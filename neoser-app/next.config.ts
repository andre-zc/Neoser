import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [128, 256, 384, 512, 640, 768],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    qualities: [70, 75, 90],
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@calcom/embed-react",
    ],
  },

  async headers() {
    // Solo aplicar cache agresivo en produccion. En dev rompe HMR/Turbopack
    // (chunks "inmutables" hacen que el browser sirva versiones viejas).
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
