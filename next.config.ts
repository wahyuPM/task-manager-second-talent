import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	output: "standalone",
	allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
