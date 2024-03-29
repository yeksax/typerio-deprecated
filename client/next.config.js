/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "source.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3001",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.imgur.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
