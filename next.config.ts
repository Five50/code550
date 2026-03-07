import type { NextConfig } from "next";

// Parse hostname from WORDPRESS_URL so images.remotePatterns stays in sync
const wpUrl = process.env.WORDPRESS_URL;
const wpHostname = wpUrl ? new URL(wpUrl).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.WORDPRESS_HOSTNAME}`,
        port: "",
        pathname: "/**",
      },
      ...(wpHostname && wpHostname !== process.env.WORDPRESS_HOSTNAME
        ? [{ protocol: "https" as const, hostname: wpHostname, port: "", pathname: "/**" }]
        : []),
    ],
  },
  async redirects() {
    return [
      { source: '/posts/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/posts', destination: '/blog', permanent: true },
      { source: '/pages/:slug', destination: '/:slug', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${process.env.WORDPRESS_URL}/wp-content/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
