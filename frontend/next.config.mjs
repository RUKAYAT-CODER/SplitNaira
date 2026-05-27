import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 'standalone' output is required for Docker-based self-hosting (see frontend/Dockerfile).
  // Vercel sets VERCEL=1 in its build environment and manages its own output format,
  // so standalone mode must be disabled there to allow Vercel's native Next.js builder
  // to produce correctly structured serverless and edge function artifacts.
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  experimental: {
    optimizePackageImports: ["clsx"]
  }
};

export default withNextIntl(nextConfig);
