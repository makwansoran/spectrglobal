import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 92, 95],
  },
  async redirects() {
    return [
      {
        source: "/drones",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/centurion",
        destination: "/",
        permanent: true,
      },
      {
        source: "/newsroom/:category/recon-field-readiness-2026",
        destination: "/newsroom",
        permanent: true,
      },
      {
        source: "/documentation/recon-sensing-configuration",
        destination: "/documentation/centurion-mission-software-overview",
        permanent: true,
      },
      {
        source: "/documentation/valkyrie-sensing-configuration",
        destination: "/documentation/centurion-mission-software-overview",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
