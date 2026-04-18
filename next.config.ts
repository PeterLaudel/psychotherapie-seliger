import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESM-only; required so Jest (next/jest) transpiles this package from node_modules
  transpilePackages: ["@faker-js/faker"],
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
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
