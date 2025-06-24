import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.IS_OUTPUT_EXPORT ? "export" : "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        basePath: false,
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.justboil.me",
      },
    ],
  },
};

export default nextConfig;
