import { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: () => {
    return Promise.resolve([
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ]);
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
