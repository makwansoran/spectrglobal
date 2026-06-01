import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
