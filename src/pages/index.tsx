// src/pages/index.tsx

import React from 'react';
import Layout from '../app/layout';

function Home() {
  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-700">
          This is the homepage of my portfolio website.
        </p>
      </div>
  );
}

export default Home;
