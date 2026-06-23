import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/drones",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/products/spectr-uav",
        destination: "/products/valkyrie",
        permanent: true,
      },
      {
        source: "/products/recon",
        destination: "/products/valkyrie",
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
