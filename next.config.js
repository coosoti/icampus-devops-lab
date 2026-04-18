/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.64.2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;