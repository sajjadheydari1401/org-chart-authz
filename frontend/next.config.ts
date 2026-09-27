import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // page.dev.tsx is discoverable in `next dev` and excluded from production routes.
  pageExtensions:
    process.env.NODE_ENV === "development"
      ? ["dev.tsx", "tsx", "ts", "jsx", "js"]
      : ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
