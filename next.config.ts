import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 92, 95],
  },
  async redirects() {
    return [
      { source: "/no", destination: "/", permanent: true },
      { source: "/no/:path*", destination: "/:path*", permanent: true },
      { source: "/research", destination: "/robotics", permanent: true },
      { source: "/object-intelligence", destination: "/wms", permanent: true },
      { source: "/drones", destination: "/", permanent: true },
      { source: "/products/:path*", destination: "/", permanent: true },
      { source: "/centurion", destination: "/robotics", permanent: true },
      { source: "/autonomous-engine", destination: "/robotics", permanent: true },
      { source: "/newsroom", destination: "/news", permanent: true },
      { source: "/newsroom/:path*", destination: "/news", permanent: true },
      { source: "/documentation/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
