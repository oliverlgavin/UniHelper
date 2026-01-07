import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude native modules from webpack bundling
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'canvas',
      });
    }
    return config;
  },
};

export default withPWA(nextConfig);
