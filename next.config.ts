import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 92, 95],
  },
  async redirects() {
    return [
      { source: "/no", destination: "/", permanent: true },
      { source: "/no/:path*", destination: "/:path*", permanent: true },
      { source: "/research", destination: "/", permanent: true },
      { source: "/object-intelligence", destination: "/wms", permanent: true },
      { source: "/drones", destination: "/", permanent: true },
      { source: "/products/:path*", destination: "/", permanent: true },
      { source: "/centurion", destination: "/", permanent: true },
      { source: "/autonomous-engine", destination: "/", permanent: true },
      { source: "/robotics", destination: "/", permanent: true },
      { source: "/robotics/:path*", destination: "/", permanent: true },
      { source: "/newsroom", destination: "/news", permanent: true },
      { source: "/newsroom/:path*", destination: "/news", permanent: true },
      { source: "/documentation/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
