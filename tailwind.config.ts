import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-fira)']
      },
      colors: {
        teal: {
          500: '#008080', // Your original teal color
        },
        tan: '#CDBCB1', // Your new tan color
      },
    },
  },
  plugins: [],
}
export default config
