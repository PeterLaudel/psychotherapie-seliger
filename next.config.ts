import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller traced server tree for pkg; post-build copies static + public into standalone
  output: "standalone",
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
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
