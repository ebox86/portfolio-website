// pages/_app.js

import Layout from '../app/layout';
import '../styles/globals.css'; // Import your global styles here
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
