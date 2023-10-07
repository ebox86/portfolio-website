import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-screen-md flex-grow">
        <Header />
        <main className="px-4 py-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
