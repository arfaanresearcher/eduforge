import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["dockerode", "ssh2"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
