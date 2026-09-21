import type { NextConfig } from "next";

// Static export for GitHub Pages (mock-data-only, no backend). Set by the
// `deploy-pages` GitHub Actions workflow; everything else (local dev,
// Docker, Vercel) keeps the standalone server + API rewrites.
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
    // Static export has no image optimization server to run against.
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  ...(isStaticExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
      }
    : {
        output: "standalone",
        async rewrites() {
          const backend = process.env.BACKEND_URL ?? "http://localhost:8000";
          return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
        },
      }),
};

export default nextConfig;
