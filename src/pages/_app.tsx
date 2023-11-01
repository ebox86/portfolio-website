import '../styles/globals.css';
import { AppProps } from 'next/app';
import localFont from 'next/font/local';
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('../app/layout'), {
  ssr: false,
});

const fira = localFont({
  src: [
    {
      path: '../styles/FiraCode-Light.ttf',
      weight: '300'
    },
    {
      path: '../styles/FiraCode-Regular.ttf',
      weight: '400'
    },
    {
      path: '../styles/FiraCode-Medium.ttf',
      weight: '500'
    },
    {
      path: '../styles/FiraCode-SemiBold.ttf',
      weight: '600'
    },
    {
      path: '../styles/FiraCode-Bold.ttf',
      weight: '700'
    }
  ],
  variable: '--font-fira'
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${fira.variable} font-sans`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}

export default MyApp;
