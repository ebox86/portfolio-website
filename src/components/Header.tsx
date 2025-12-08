import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type HeaderProps = {
  theme?: 'light' | 'dark';
  themeMode?: 'light' | 'dark' | 'auto';
  onToggleTheme?: () => void;
};

const Header: React.FC<HeaderProps> = ({ theme = 'light', themeMode = 'light', onToggleTheme }) => {
  const router = useRouter();
  const [showSystemIcon, setShowSystemIcon] = useState(themeMode !== 'auto');

  useEffect(() => {
    if (themeMode === 'auto') {
      setShowSystemIcon(false);
      const t = setTimeout(() => setShowSystemIcon(true), 1800);
      return () => clearTimeout(t);
    }
    setShowSystemIcon(true);
  }, [themeMode]);

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
                className="logo-trace-svg translate-y-[15px]"
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
            <div className="relative group ml-2 z-50">
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="px-3 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span className="relative inline-flex h-5 w-5 items-center justify-center align-middle">
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      themeMode === 'auto' && !showSystemIcon ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    ⚙️
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      themeMode === 'auto' && !showSystemIcon ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    {theme === 'dark' ? '☀️' : '🌙'}
                  </span>
                </span>
              </button>
              <div className="pointer-events-none absolute left-1/2 top-[110%] z-[9999] -translate-x-1/2 max-w-[220px] whitespace-normal rounded-md bg-black/90 px-3 py-1.5 text-xs leading-tight text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {themeMode === 'auto'
                  ? 'Toggle light mode'
                  : themeMode === 'light'
                  ? 'Toggle dark mode'
                  : 'Toggle system default'}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
