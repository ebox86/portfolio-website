import React from 'react';
import Link from 'next/link';
// import RandomShape from './RandomShape';

function Header() {
  return (
    <header className="py-4">
      <div className="container mx-auto">
      <nav className="flex justify-between items-center flex-col md:flex-row px-4">
          <Link href="/">
            <div className="text-5xl md:text-6xl font-bold text-center md:text-left cursor-pointer">
              <div className="text-3xl relative">
                <span className="gradient-text" data-content="@ebox86">@ebox86</span>
              </div>
            </div>
          </Link>
          <ul className="flex space-x-4 flex-wrap justify-center">
            <li className="text-lg relative group p-2">
              <Link href="/me">About</Link>
            </li>
            <li className="text-lg relative group p-2">
              <Link href="/blog">Blog</Link>
            </li>
            {/* <li className="text-lg relative group p-2">
              <Link href="/projects">Projects</Link>
            </li> */}
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
