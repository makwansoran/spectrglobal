import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 92, 95],
  },
  transpilePackages: ["mapbox-gl"],
  async redirects() {
    return [
      { source: "/signup", destination: "/login", permanent: true },
      { source: "/create-account.html", destination: "/login", permanent: true },
      { source: "/create-account", destination: "/login", permanent: true },
      { source: "/careers/signup", destination: "/careers/login", permanent: true },
      { source: "/no", destination: "/", permanent: true },
      { source: "/no/:path*", destination: "/:path*", permanent: true },
      { source: "/object-intelligence", destination: "/platforms/spectr-os", permanent: true },
      { source: "/platforms/aim", destination: "/platforms/spectr-os", permanent: true },
      { source: "/platforms/metaphysics", destination: "/platforms/spectr-os", permanent: true },
      { source: "/platforms/argus", destination: "/platforms/spectr-os", permanent: true },
      { source: "/drones", destination: "/", permanent: true },
      { source: "/centurion", destination: "/", permanent: true },
      { source: "/autonomous-engine", destination: "/", permanent: true },
      { source: "/robotics", destination: "/", permanent: true },
      { source: "/robotics/:path*", destination: "/", permanent: true },
      { source: "/wms", destination: "/platforms/spectr-os", permanent: true },
      { source: "/wms/:path*", destination: "/platforms/spectr-os", permanent: true },
      { source: "/newsroom", destination: "/news", permanent: true },
      { source: "/newsroom/:path*", destination: "/news", permanent: true },
      { source: "/documentation", destination: "/developers", permanent: true },
      { source: "/documentation/:path*", destination: "/developers", permanent: true },
      { source: "/use-cases/defense", destination: "/", permanent: true },
      { source: "/use-cases/government", destination: "/", permanent: true },
      { source: "/use-cases/healthcare", destination: "/", permanent: true },
      { source: "/use-cases/finance", destination: "/", permanent: true },
      { source: "/use-cases/shipping", destination: "/", permanent: true },
      { source: "/use-cases/mining", destination: "/", permanent: true },
      { source: "/use-cases/operations", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
