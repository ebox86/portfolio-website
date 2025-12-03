const withMDX = require('@next/mdx')({
	extension: /\.mdx?$/
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['cdn.sanity.io','cdn2.thecatapi.com','http.cat','localhost','media.giphy.com'],
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = withMDX(nextConfig);
