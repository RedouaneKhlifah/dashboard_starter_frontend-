/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  images: {
    minimumCacheTTL: 604800,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-cdn-domain.com",
        port: "",
        pathname: "/assets/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  staticPageGenerationTimeout: 180,
  experimental: {
    optimizeCss: true,
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".css",
        ".json",
      ],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, must-revalidate",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.(css|scss)$/,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

const withPlugins = () => {
  const plugins = [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === "true",
    }),
  ];

  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};

export default withPlugins();
