import Image from 'next/image';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';

const ZtPage: NextPage = () => {
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const primaryText = isDark ? 'text-slate-50' : 'text-slate-900';
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentClass = isDark ? 'text-amber-300' : 'text-[#c2410c]';

  const secondaryButtonClasses = isDark
    ? 'border-white/40 text-white hover:border-white'
    : 'border-slate-900/30 text-slate-900 hover:border-[#7c2d12] hover:text-[#7c2d12]';

  return (
    <section className="space-y-10 w-full max-w-[1040px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-shrink-0">
          <Image
            src="/images/cloudflare-zero-trust.png"
            alt="Cloudflare Zero Trust artwork"
            width={212}
            height={212}
            className="h-auto w-[min(212px,100%)] rounded-3xl object-cover"
            priority
          />
        </div>
        <div>
          <p className={`text-xs uppercase tracking-[0.6em] ${accentClass}`}>Cloudflare Zero Trust</p>
          <h1 className={`text-4xl font-semibold sm:text-5xl ${primaryText}`}>ebox86 Zero Trust</h1>
          <h3 className={`mt-2 text-xl ${secondaryText}`}>Zero trust access for Evan’s networks and devices</h3>
          <p className={`mt-4 max-w-2xl text-base sm:text-lg ${secondaryText}`}>
            All managed endpoints route through Cloudflare Zero Trust to ensure secure access to internal tooling,
            production dashboards, and sensitive data.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          href="/zt/enroll"
          className="flex-1 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-center text-lg font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-[0_20px_45px_rgba(248,195,113,0.35)]"
        >
          Enroll a device
        </Link>
        <Link
          href="/zt/support"
          className={`flex-1 rounded-2xl border px-6 py-4 text-center text-lg font-semibold transition ${secondaryButtonClasses}`}
        >
          Troubleshoot support
        </Link>
      </div>

      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-baseline sm:gap-6">
        <p className={`${secondaryText}`}>
          <span className={`font-semibold ${accentClass}`}>Team:</span> ebox86 · Cloudflare Zero Trust organization
        </p>
        <p className={`${secondaryText}`}>
          <span className={`font-semibold ${accentClass}`}>Policy:</span> Device posture & identity checks for Cloudflare WARP
          protected access
        </p>
      </div>
    </section>
  );
};

export default ZtPage;
