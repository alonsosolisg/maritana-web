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
  serverComponentsExternalPackages: ["pdfjs-dist", "canvas"],
  webpack: (config, { isServer }) => {
    // Replace canvas with empty stub for both client and server
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: require.resolve("./lib/canvas-stub.js"),
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    
    // Also ignore it as a plugin
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^canvas$/,
      })
    );
    
    return config;
  },
  turbopack: {},
};

export default nextConfig;
