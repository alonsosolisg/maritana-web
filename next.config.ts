import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/catalogo.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  serverComponentsExternalPackages: ["pdfjs-dist"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^canvas$/,
        })
      );
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
