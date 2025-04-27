/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
		remotePatterns: [
			{
				hostname: "i3.ytimg.com",
			},
		],
	},
};

export default nextConfig;
