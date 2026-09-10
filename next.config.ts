import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project repo from /<repo>/, so assets need a basePath.
 * The deploy workflow sets NEXT_PUBLIC_BASE_PATH automatically.
 * A user site (OhanaeL.github.io) serves from the root — leave it unset there.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Fully static site — no server needed, deploys anywhere.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
