import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "picsum.photos",
      "i.pinimg.com",
      "pub-bae031a3020f4896bce13a70fdc7cf27.r2.dev",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
