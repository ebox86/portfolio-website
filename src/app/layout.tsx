'use client';

import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition'; 
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>@ebox86</title>
        <meta name="description" content="The personal website of Evan Kohout" />
        <meta name="keywords" content="ebox86, website, portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="@ebox86" />
        <meta property="og:description" content="The personal website of Evan Kohout" />
        <meta property="og:url" content="https://ebox86.com" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="container mx-auto max-w-screen-md flex-grow">
        <Header />
        <main className="px-4 py-8">
        <AnimatePresence mode='wait'>
          <PageTransition route={pathname || ''}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
      </div>
      <Footer />
    </div>
  );
}
export default Layout;