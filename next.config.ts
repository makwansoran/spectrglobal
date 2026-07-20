import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 92, 95],
  },
  async redirects() {
    return [
      { source: "/drones", destination: "/", permanent: true },
      { source: "/products/:path*", destination: "/", permanent: true },
      { source: "/centurion", destination: "/", permanent: true },
      { source: "/autonomous-engine", destination: "/", permanent: true },
      { source: "/newsroom", destination: "/news", permanent: true },
      { source: "/newsroom/:path*", destination: "/news", permanent: true },
      { source: "/documentation/:path*", destination: "/", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
