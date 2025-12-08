import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import ThemeContext from '../context/ThemeContext';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [spinOffset, setSpinOffset] = useState<string>('0s');
  const [showBanner, setShowBanner] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const [confettiPieces, setConfettiPieces] = useState<
    {
      id: number;
      left: number;
      delay: number;
      duration: number;
      color: string;
      drift: number;
      startY: string;
      rotation: string;
    }[]
  >([]);
  const DISMISS_COOKIE = 'whimsy-banner-dismissed';

  const hasDismissed = () =>
    typeof document !== 'undefined' &&
    document.cookie.split(';').some((c) => c.trim().startsWith(`${DISMISS_COOKIE}=`));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMode = window.localStorage.getItem('themeMode');
      const storedTheme = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const initialMode: 'light' | 'dark' | 'auto' =
        storedMode === 'light' || storedMode === 'dark' || storedMode === 'auto'
          ? (storedMode as 'light' | 'dark' | 'auto')
          : storedTheme === 'light' || storedTheme === 'dark'
          ? (storedTheme as 'light' | 'dark')
          : 'auto';

      const initialTheme: 'light' | 'dark' =
        initialMode === 'auto' ? (prefersDark ? 'dark' : 'light') : (initialMode as 'light' | 'dark');

      setThemeMode(initialMode);
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'auto') {
        const nextTheme = e.matches ? 'dark' : 'light';
        setTheme(nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        window.localStorage.setItem('theme', nextTheme);
      }
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme: 'light' | 'dark' = themeMode === 'auto' ? (prefersDark ? 'dark' : 'light') : themeMode;
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem('themeMode', themeMode);
    window.localStorage.setItem('theme', nextTheme);
  }, [themeMode]);

  useEffect(() => {
    // Compute spin offset on client to avoid hydration mismatch.
    const durationMs = 60000; // match CSS spin duration
    const offsetSeconds = -((Date.now() % durationMs) / 1000);
    setSpinOffset(`${offsetSeconds}s`);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = hasDismissed();
    setShowBanner(!dismissed);

    const handleFocus = () => {
      if (!hasDismissed()) {
        setShowBanner(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const rememberDismissal = () => {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${DISMISS_COOKIE}=1; max-age=${maxAge}; path=/; SameSite=Lax; Secure`;
  };

  const dismissBanner = () => {
    setShowBanner(false);
    if (typeof document !== 'undefined') {
      rememberDismissal();
    }
  };

  const launchConfetti = () => {
    const colors = ['#f97316', '#a855f7', '#22d3ee', '#facc15', '#ef4444'];
    const pieces = Array.from({ length: 120 }).map((_, idx) => ({
      id: Date.now() + idx,
      left: Math.random() * 100,
      delay: Math.random() * 300,
      duration: 900 + Math.random() * 800,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 180,
      startY: `${-20 + Math.random() * 40}vh`, // start between -20vh and 20vh
      rotation: `${360 + Math.random() * 720}deg`,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 2200);
  };

  const spinStyle: React.CSSProperties = {
    ['--spin-offset' as any]: spinOffset,
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.add('theme-fade');
    const timer = setTimeout(() => root.classList.remove('theme-fade'), 250);
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-gray-100">
      <style jsx global>{`
        :root.theme-fade, :root.theme-fade * {
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
      `}</style>
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
      <div className="flex-grow flex items-start justify-center">
        <div className="w-full max-w-5xl px-4 py-10">
          <div className="border-frame" style={spinStyle}>
            <div className="animated-border" aria-hidden="true" />
            <div className="animated-border-glow" aria-hidden="true" />
            <div className="content-surface overflow-hidden relative dark:bg-gray-900 dark:border-gray-800">
              <Header theme={theme} themeMode={themeMode} onToggleTheme={toggleTheme} />
              <main className="w-full max-w-[52rem] mx-auto px-6 md:px-10 pt-8 pb-16">{children}</main>
              <Footer />
              {showBanner && (
                <div className="fixed left-4 right-4 bottom-6 md:left-auto md:right-6 md:max-w-xl bg-white border-2 border-purple-500 shadow-2xl rounded-xl px-5 py-4 z-50">
                  <button
                    aria-label="Dismiss"
                    onClick={dismissBanner}
                    className="absolute top-1 right-2 text-3xl font-extrabold text-purple-700 hover:text-purple-900"
                  >
                    ✕
                  </button>
                  <div className="text-lg font-semibold text-purple-900 mb-2">
                    I don&apos;t use cookies, but you can click these buttons anyway:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={dismissBanner}
                      className="px-3 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                    >
                      Accept Anyway
                    </button>
                    <button
                      onClick={dismissBanner}
                      className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                    >
                      Reject the Non-Cookies
                    </button>
                    <button
                      onClick={() => {
                        launchConfetti();
                        dismissBanner();
                      }}
                      className="px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                    >
                      Surprise Me
                    </button>
                  </div>
                </div>
              )}
              {confettiPieces.length > 0 && (
                <div className="confetti-container pointer-events-none">
                  {confettiPieces.map((piece) => (
                    <span
                      key={piece.id}
                      className="confetti-piece"
                      style={{
                        left: `${piece.left}%`,
                        animationDelay: `${piece.delay}ms`,
                        animationDuration: `${piece.duration}ms`,
                        ['--duration' as any]: `${piece.duration}ms`,
                        backgroundColor: piece.color,
                        ['--drift' as any]: `${piece.drift}px`,
                        ['--start-y' as any]: piece.startY,
                        ['--rot' as any]: piece.rotation,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Layout;
