// src/app/Layout.tsx

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-screen-md">
        <Header />
        <main className="px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
