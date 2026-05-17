import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${process.env.API_URL || "http://backend:4000"}/storage/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
