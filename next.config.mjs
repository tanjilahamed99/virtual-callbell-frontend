/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows all hostnames
      },
      {
        protocol: "http",
        hostname: "**", // (optional) if you also want http
      },
    ],
  },
};

export default nextConfig;
