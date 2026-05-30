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
        source: "/products/spectr-attack",
        destination: "/products/attack",
        permanent: true,
      },
      {
        source: "/products/spectr-uav",
        destination: "/products/recon",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
