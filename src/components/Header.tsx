// src/components/Header.tsx

import React from 'react';
import Link from 'next/link';
// import RandomShape from './RandomShape';

function Header() {
  // const getRandomClipPath = () => {
  //   const shapes = [
  //     'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  //     'polygon(0% 0%, 100% 0%, 50% 100%)',
  //     'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  //     'polygon(0% 0%, 0% 100%, 100% 50%)',
  //     // Add more polygonal shapes as needed
  //   ];

  //   const randomIndex = Math.floor(Math.random() * shapes.length);
  //   return shapes[randomIndex];
    
  // };

  return (
    <header className="py-4">
      <div className="container mx-auto">
      <nav className="flex justify-between items-center flex-col md:flex-row px-4">
          <Link href="/">
            <div className="text-5xl md:text-6xl font-bold text-center md:text-left cursor-pointer">
              <div className="text-lg md:text-3xl relative">
                <span className="gradient-text" data-content="@ebox86">@ebox86</span>
              </div>
              <div className="text-xs md:text-sm">
                the personal website of Evan Kohout
              </div>
            </div>
          </Link>
          <ul className="flex space-x-4">
            <li className="text-lg relative group p-2">
              <Link href="/about">Blog</Link>
            </li>
            <li className="text-lg relative group p-2">
              <Link href="/projects">Projects</Link>
            </li>
            <li className="text-lg relative group p-2">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
