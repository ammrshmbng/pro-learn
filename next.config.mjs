/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "i3.ytimg.com",
			},
		],
	},
	typescript: {
		// ⚠️ Ini akan mengabaikan error TypeScript selama production build
		ignoreBuildErrors: true,
	},
	eslint: {
		// Ini akan mengabaikan error ESLint selama production build
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
