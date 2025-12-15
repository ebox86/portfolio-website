import Image from 'next/image';
import Link from 'next/link';
import type { NextPage } from 'next';
import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiClipboard } from 'react-icons/fi';
import CloudflareBadge from '../../components/CloudflareBadge';
import ThemeContext from '../../context/ThemeContext';

const downloadLinks = [
  {
    label: 'Windows (GA)',
    platform: 'Windows',
    url: 'https://downloads.cloudflareclient.com/v1/download/windows/ga',
    icon: '/icons/zt/windows.svg',
    description: 'Download installer',
  },
  {
    label: 'macOS (GA)',
    platform: 'macOS',
    url: 'https://downloads.cloudflareclient.com/v1/download/macos/ga',
    icon: {
      light: '/icons/zt/apple.png',
      dark: '/icons/zt/apple-light.png',
    },
    description: 'Download installer',
  },
  {
    label: 'Linux package',
    platform: 'Linux',
    url: 'https://pkg.cloudflareclient.com/',
    icon: '/icons/zt/linux.svg',
    description: 'Add the Linux package',
  },
  {
    label: 'iOS App Store',
    platform: 'iOS',
    url: 'https://apps.apple.com/us/app/cloudflare-one-agent/id6443476492',
    icon: '/icons/zt/ios.svg',
  },
  {
    label: 'Android Play Store',
    platform: 'Android',
    url: 'https://play.google.com/store/apps/details?id=com.cloudflare.cloudflareoneagent',
    icon: '/icons/zt/android.svg',
  },
];

const downloadSections = [
  {
    id: 'desktop',
    items: downloadLinks.slice(0, 3),
  },
  {
    id: 'mobile',
    items: downloadLinks.slice(3),
  },
];

const highlightTerms = ['Preferences', 'Account', 'ebox86', '⚙️', 'Join team'];
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const highlightPattern = `(${highlightTerms.map((value) => escapeRegex(value)).join('|')})`;

const renderHighlightedStep = (step: string) => {
  const regex = new RegExp(highlightPattern, 'gi');
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(step)) !== null) {
    if (match.index > lastIndex) {
      parts.push(step.slice(lastIndex, match.index));
    }
      parts.push(
        <span
          key={`${step}-${match.index}`}
          className="inline-flex items-center rounded-md border border-[#f97316] bg-[#fef3c7] px-1 py-0.5 text-xs font-semibold text-[#c2410c] leading-none mx-1"
        >
          {match[0]}
        </span>
      );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < step.length) {
    parts.push(step.slice(lastIndex));
  }
  return parts;
};

const instructionSections = [
  {
    id: 'desktop',
    title: 'Desktop enrollment',
    steps: [
      'Launch the Cloudflare WARP client.',
      'Select the Cloudflare logo in the menu bar or system tray.',
      'Open the gear icon ⚙️ and visit Preferences > Account.',
      'Choose “Login with Cloudflare Zero Trust”.',
      'Enter the team name ebox86 and continue.',
      'Complete the authentication steps required by Google.',
      'When the Success page appears, confirm that Cloudflare WARP opens.',
      'The device is now managed by the ebox86 Zero Trust policies.',
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile enrollment',
    steps: [
      'Install Cloudflare One from the App Store or Play Store.',
      'Open the app, tap the Cloudflare logo, and choose Join team.',
      'Enter ebox86 or tap the link below to skip typing the team name.',
      'Follow the authentication prompts required by Google.',
      'Accept the registration dialog to open Cloudflare WARP.',
    ],
  },
];

const mobileEnrollUrl = 'cf1app://oneapp.cloudflare.com/team?name=ebox86';

const EnrollPage: NextPage = () => {
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const primaryText = isDark ? 'text-slate-50' : 'text-slate-900';
  const bodyText = isDark ? 'text-slate-300' : 'text-slate-600';
  const instructionText = isDark ? 'text-slate-200' : 'text-slate-700';
  const accentClass = isDark ? 'text-amber-300' : 'text-[#c2410c]';
  const returnHoverClass = isDark ? 'hover:text-amber-300' : 'hover:text-[#f97316]';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200';
  const copyBoxBg = isDark ? 'bg-slate-900/60 text-slate-50' : 'bg-white text-slate-900';
  const copyBoxBorder = isDark ? 'border-white/20' : 'border-slate-300';
  const copyButtonBg = isDark ? 'bg-[#c2410c]' : 'bg-[#E3873B]';
  const copyButtonHover = isDark ? 'hover:bg-[#ea580c]' : 'hover:bg-[#c2410c]';
  const [shareStatus, setShareStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const enrollmentLink = mobileEnrollUrl;

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!shareStatus) return;
    const timer = setTimeout(() => setShareStatus(''), 1800);
    return () => clearTimeout(timer);
  }, [shareStatus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enrollmentLink);
      setShareStatus('Enrollment link copied!');
    } catch (error) {
      setShareStatus('Copy failed, try again.');
    }
  };

  const resolveIconSrc = (icon: string | { light: string; dark?: string }) => {
    if (typeof icon === 'string') return icon;
    return isDark && icon.dark ? icon.dark : icon.light;
  };

  return (
    <section className="space-y-10 w-full">
      <header className="space-y-4">
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
            <p className={`text-sm uppercase tracking-[0.4em] ${accentClass}`}>Cloudflare Zero Trust</p>
            <h1 className={`text-4xl font-semibold ${primaryText}`}>Enroll a device with ebox86</h1>
            <p className={`max-w-3xl text-base ${bodyText}`}>
              Download the WARP client that matches your device and follow the enrollment steps below. These flows
              mirror Cloudflare&apos;s guidance for registering endpoints with the ebox86 Zero Trust policy.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-10">
        <section className="space-y-5">
          <div>
            <p className={`text-xs uppercase tracking-[0.4em] ${accentClass}`}>enrollment setup</p>
            <h2 className={`text-2xl font-semibold ${primaryText}`}>Download WARP client installers</h2>
          </div>
          <p className={`text-sm ${bodyText}`}>Grab the Cloudflare WARP client or Linux package that matches your operating system.</p>
          {downloadSections.map((section) => (
            <div
              key={section.id}
              className={`grid gap-3 ${section.id === 'desktop' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
            >
              {section.items.map((download) => (
                <a
                  key={download.label}
                  href={download.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-4 rounded-3xl border px-5 py-4 transition hover:border-[#f97316]/80 ${cardBorder}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Image src={resolveIconSrc(download.icon)} alt={download.label} width={36} height={36} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{download.platform}</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{download.label}</p>
                    <p className={`text-xs ${bodyText}`}>
                      {download.description ?? (section.id === 'desktop' ? 'Download installer' : 'Open store listing')}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </section>

        <section className="space-y-5">
          <div>
            <p className={`text-xs uppercase tracking-[0.4em] ${accentClass}`}>Enrollment instructions</p>
            <h2 className={`text-2xl font-semibold ${primaryText}`}>Desktop & mobile flows</h2>
            <p className={`text-sm ${bodyText}`}>
              The steps below reflect Cloudflare&apos;s manual deployment guidance for WARP. Refer to the{' '}
              <Link
                href="https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/deployment/manual-deployment/"
                target="_blank"
                rel="noreferrer"
                className={`font-semibold ${isDark ? 'text-[#f97316]' : 'text-[#c2410c]'}`}
              >
                manual deployment guide
              </Link>{' '}
              for additional options.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {instructionSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{section.title}</p>
                </div>
                <ol className={`mt-1 list-decimal space-y-2 pl-5 text-sm ${instructionText}`}>
                  {section.steps.map((step) => (
                    <li key={step}>{renderHighlightedStep(step)}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-transparent p-6 shadow-none dark:border-slate-800/70">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr] lg:items-center">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Mobile quick enroll</p>
                <h3 className={`text-2xl font-semibold ${primaryText}`}>Cloudflare One deep link</h3>
                <p className={`text-sm ${bodyText}`}>
                  Copy the enrollment deep link that lands directly on the ebox86 team, or scan the QR code to the right
                  when you need a faster way to get the mobile client registered.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowModal(true)}
                  onKeyDown={(event) => event.key === 'Enter' && setShowModal(true)}
                  className="rounded-2xl border border-dashed border-[#f97316] p-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <Image
                    src="/images/enroll_qr.png"
                    alt="QR code for Cloudflare One team enrollment"
                    width={220}
                    height={220}
                    className="h-auto w-48 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] items-stretch">
              <div
                className={`rounded-2xl border ${copyBoxBorder} px-4 py-3 text-lg font-semibold tracking-[0.3em] text-[#c2410c] ${copyBoxBg}`}
                style={{ fontFamily: 'Consolas, "Courier New", monospace', letterSpacing: '0.2em' }}
              >
                oneapp.cloudflare.com/team?name=ebox86
              </div>
              <button
                onClick={handleCopy}
                className={`flex h-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-lg shadow-[#7c2d12]/30 transition ${copyButtonBg} ${copyButtonHover}`}
              >
                <FiClipboard size={16} />
                Copy
              </button>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Tap the link that matches your operating system to install or open the Cloudflare One client.</li>
              <li>• Re-run authentication via this link after reinstalling WARP to refresh posture mappings.</li>
            </ul>
          </div>
        </section>
      </div>

      {showModal && isBrowser &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowModal(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 rounded-3xl bg-slate-900/90 p-6 shadow-2xl shadow-black font-sans">
              <Image
                src="/images/enroll_qr.png"
                alt="Expanded Cloudflare One QR"
                width={320}
                height={320}
                className="h-auto w-80 rounded-3xl"
              />
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 font-sans tracking-tight"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}

      {shareStatus && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-2xl">
          <FiClipboard size={16} />
          {shareStatus}
        </div>
      )}
    </section>
  );
};

export default EnrollPage;
