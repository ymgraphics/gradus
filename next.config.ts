import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disabled: Turbopack's on-disk cache corrupts on this exFAT volume
    // (macOS AppleDouble ._ files break its persistence directory parsing).
    // Re-enable if the project moves to an APFS/internal disk.
    turbopackFileSystemCacheForDev: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gradus.ma",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV !== "production",
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Long-term caching for static assets
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Localized portfolio index anchors
      {
        source: "/en/portfolio",
        destination: "/en#portfolio",
        permanent: true,
      },
      {
        source: "/fr/portfolio",
        destination: "/fr#portfolio",
        permanent: true,
      },
      // Legacy WordPress portfolio slugs → new project pages (301 preserves SEO value)
      // Unmatched /portfolio/* paths fall through to middleware 410
      {
        source: "/portfolio/corniche-3d",
        destination: "/projects/corniche-conception-3d",
        permanent: true,
      },
      {
        source: "/portfolio/dar-dada",
        destination: "/projects/dar-dada-marketing-digital",
        permanent: true,
      },
      {
        source: "/portfolio/louna",
        destination: "/projects/louna-marketing-digital",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
