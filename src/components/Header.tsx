import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type HeaderProps = {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
};

const Header: React.FC<HeaderProps> = ({ theme = 'light', onToggleTheme }) => {
  const router = useRouter();
  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/';
    if (href === '/blog') return router.pathname.startsWith('/blog');
    return router.pathname.startsWith(href);
  };

  return (
    <header className="py-6 px-6 md:px-10">
      <nav className="flex justify-between items-center flex-col md:flex-row gap-3">
        <Link href="/">
          <div className="text-5xl md:text-6xl font-bold text-center md:text-left cursor-pointer">
            <div className="text-3xl relative logo-trace-wrapper">
              <svg
                className="logo-trace-svg"
                viewBox="0 0 220 90"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient id="logoTraceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
                <text x="6" y="58" className="logo-trace-text">@ebox86</text>
              </svg>
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-3">
          <ul className="flex space-x-4 flex-wrap justify-center">
            <li className="text-lg relative group p-2">
              <Link href="/me" className={`nav-underline${isActive('/me') ? ' is-active' : ''}`}>About</Link>
            </li>
            <li className="text-lg relative group p-2">
              <Link href="/projects" className={`nav-underline${isActive('/projects') ? ' is-active' : ''}`}>Projects</Link>
            </li>
            <li className="text-lg relative group p-2">
              <Link href="/blog" className={`nav-underline${isActive('/blog') ? ' is-active' : ''}`}>Blog</Link>
            </li>
            <li className="text-lg relative group p-2">
              <Link href="/contact" className={`nav-underline${isActive('/contact') ? ' is-active' : ''}`}>Contact</Link>
            </li>
          </ul>
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="ml-2 px-3 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
