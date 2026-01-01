const withMDX = require('@next/mdx')({
	extension: /\.mdx?$/
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['cdn.sanity.io','cdn2.thecatapi.com','http.cat','localhost','media.giphy.com'],
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
	async redirects() {
		return [
			{
				source: '/social/linkedin',
				destination: 'https://www.linkedin.com/in/evan-kohout/',
				permanent: true,
			},
			{
				source: '/social/github',
				destination: 'https://github.com/ebox86',
				permanent: true,
			},
			{
				source: '/social/x',
				destination: 'https://twitter.com/ebox86',
				permanent: true,
			},
			{
				source: '/social/twitter',
				destination: 'https://twitter.com/ebox86',
				permanent: true,
			},
		];
	},
}

module.exports = withMDX(nextConfig);
