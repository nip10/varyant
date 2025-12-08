import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  // in a hurry, so we'll allow all domains for images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
