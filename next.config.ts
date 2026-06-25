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
        destination: "/products",
        permanent: true,
      },
      {
        source: "/products/spectr-uav",
        destination: "/products/recon",
        permanent: true,
      },
      {
        source: "/products/valkyrie",
        destination: "/products/recon",
        permanent: true,
      },
      {
        source: "/newsroom/:category/valkyrie-field-readiness-2026",
        destination: "/newsroom/:category/recon-field-readiness-2026",
        permanent: true,
      },
      {
        source: "/documentation/valkyrie-sensing-configuration",
        destination: "/documentation/recon-sensing-configuration",
        permanent: true,
      },
      {
        source: "/centurion",
        destination: "/products/centurion",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
