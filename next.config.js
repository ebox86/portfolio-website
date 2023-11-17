const withMDX = require('@next/mdx')({
	extension: /\.mdx?$/
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['cdn.sanity.io','cdn2.thecatapi.com','http.cat','localhost'],
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
	reactStrictMode: false
}

module.exports = withMDX(nextConfig);