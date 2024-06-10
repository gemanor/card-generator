import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.remaker.ai",
        port: "",
        pathname: "**",
      },
    ],
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff(2)?$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "media/[name]-[sha512:hash:base64:7].[ext]",
            outputPath: (url, resourcePath, context) => {
              console.warn({ url, resourcePath, context });
              return url;
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
