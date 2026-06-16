import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  transpilePackages: ["@storybook/react", "@next-app/ui-kit"],
  /** Скрыть кнопку Next.js Dev Tools в левом нижнем углу (только dev). */
  devIndicators: false,
};

export default withPayload(nextConfig);
