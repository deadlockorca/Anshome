import type { NextConfig } from "next";

const allowedDevOrigins = ["localhost", "127.0.0.1", "192.168.0.2"];

const customDevOrigin = process.env.NEXT_DEV_ORIGIN?.trim();
if (customDevOrigin) {
  allowedDevOrigins.push(customDevOrigin);
}

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
