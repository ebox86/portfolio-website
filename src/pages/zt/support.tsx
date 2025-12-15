import Link from 'next/link';
import type { GetServerSideProps, NextPage } from 'next';
import { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';
import CloudflareBadge from '../../components/CloudflareBadge';

interface SupportProps {
  ip: string;
  forwardedIp?: string | null;
  userAgent: string;
  acceptLanguage?: string | null;
  referer?: string | null;
  host?: string | null;
}

const SupportPage: NextPage<SupportProps> = ({
  ip,
  forwardedIp,
  userAgent,
  acceptLanguage,
  referer,
  host,
}) => {
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? 'text-slate-50' : 'text-slate-900';
  const bodyTextColor = isDark ? 'text-slate-300' : 'text-slate-600';
  const labelColor = 'text-slate-400';
  const rowBorderColor = isDark ? 'border-slate-800/60' : 'border-slate-200/70';
  const accentClass = isDark ? 'text-amber-300' : 'text-[#c2410c]';
  const returnHoverClass = isDark ? 'hover:text-amber-300' : 'hover:text-[#f97316]';

  return (
    <section className="space-y-8 w-full">
      <header className="space-y-2">
        <Link
          href="/zt"
          className={`text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 transition ${returnHoverClass}`}
        >
          ← Back to Zero Trust overview
        </Link>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex-shrink-0">
              <CloudflareBadge />
            </div>
            <div className="space-y-2">
              <p className={`text-sm uppercase tracking-[0.4em] ${accentClass}`}>Zero Trust Support</p>
              <h1 className={`text-4xl font-semibold ${primaryTextColor}`}>Support diagnostics</h1>
              <p className={`text-sm ${bodyTextColor}`}>
                These values are captured at the time you visit this support page. Share them with your admin for faster
                troubleshooting.
              </p>
            </div>
          </div>
        </header>

      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 text-sm">
          <div className={`space-y-2 border-b pb-4 last:border-0 ${rowBorderColor}`}>
            <p className={`text-xs uppercase tracking-[0.4em] ${labelColor}`}>IP address</p>
            <p className={`mt-2 text-lg font-semibold ${primaryTextColor}`}>{ip}</p>
            {forwardedIp && (
              <>
                <p className={`text-xs uppercase tracking-[0.4em] ${labelColor}`}>Forwarded</p>
                <p className={`text-base ${bodyTextColor}`}>{forwardedIp}</p>
              </>
            )}
          </div>
          <div className={`space-y-2 border-b pb-4 last:border-0 ${rowBorderColor}`}>
            <p className={`text-xs uppercase tracking-[0.4em] ${labelColor}`}>User agent</p>
            <p className={`mt-2 text-base ${bodyTextColor}`}>{userAgent}</p>
          </div>
          <div className={`space-y-2 border-b pb-4 last:border-0 ${rowBorderColor}`}>
            <p className={`text-xs uppercase tracking-[0.4em] ${labelColor}`}>Host</p>
            <p className={`mt-2 text-sm ${bodyTextColor}`}>{host || 'Unknown'}</p>
          </div>
          <div className={`space-y-2 border-b pb-4 last:border-0 ${rowBorderColor}`}>
            <p className={`text-xs uppercase tracking-[0.4em] ${labelColor}`}>Accept language</p>
            <p className={`mt-2 text-sm ${bodyTextColor}`}>{acceptLanguage || 'Unknown'}</p>
          </div>
          <div className={`sm:col-span-2 space-y-2 border-b pb-4 last:border-0 ${rowBorderColor}`}>
            <p className={`text-xs uppercase tracking-[0.4em] ${labelColor}`}>Referer</p>
            <p className={`mt-2 text-sm ${bodyTextColor}`}>{referer ?? 'None'}</p>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4 border-slate-200/70 text-sm dark:border-slate-800/70">
          <p className="text-base font-semibold">Quick support tip</p>
          <p className={bodyTextColor}>
            Uninstalling the WARP client and re-enrolling through the{' '}
            <Link href="/zt/enroll" className={`font-semibold ${accentClass} underline`}>
              enrollment page
            </Link>{' '}
            usually clears stale credentials and policy mismatches.
          </p>
        </div>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps<SupportProps> = async ({ req }) => {
  const forwardedHeader =
    typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'] : null;
  const realIp =
    typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : null;
  const forwardedIp = forwardedHeader?.split(',')[0].trim() || realIp || null;
  const socketAddress =
    typeof req.socket?.remoteAddress === 'string' ? req.socket.remoteAddress : 'Unknown';

  return {
    props: {
      ip: forwardedIp || socketAddress || 'Unknown',
      forwardedIp,
      userAgent: req.headers['user-agent'] ?? 'Unknown',
      acceptLanguage: req.headers['accept-language'] ?? null,
      referer: req.headers.referer ?? null,
      host: req.headers.host ?? null,
    },
  };
};

export default SupportPage;
