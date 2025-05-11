import type { NextConfig } from "next";
import path from "path";
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	runtimeCaching,
	buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig: NextConfig = withPWA({
	/* config options here */
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		dangerouslyAllowSVG: true,
		domains: ["localhost"],
	},
	sassOptions: {
		includePaths: [path.join(process.cwd(), "styles")],
		quiteDeps: true,
		silenceDeprecations: [
			"legacy-js-api",
			"import",
			"color-functions",
			"global-builtin",
			"mixed-decls",
		],
	},
});

export default nextConfig;
