/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all domains
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
