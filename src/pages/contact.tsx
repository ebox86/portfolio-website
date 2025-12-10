import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';
import { RiTwitterXFill, RiCloseLine, RiShareForwardLine, RiMailLine } from 'react-icons/ri';
import { FiClipboard, FiLink } from 'react-icons/fi';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ThemeContext from '../context/ThemeContext';

type ContactLink = {
  label?: string;
  url?: string;
  icon?: string;
  linkType?: 'social' | 'resume' | 'share';
  shareSubject?: string;
  shareBody?: string;
  resumeFileUrl?: string | null;
  tooltip?: string;
  resumeUpdatedAt?: string | null;
};

type ContactPageProps = {
  contactSubheading?: string | null;
  contactLinks: ContactLink[];
};

const ContactPage: React.FC<ContactPageProps> = ({ contactSubheading, contactLinks }) => {
  const [captchaSiteKey, setCaptchaSiteKey] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [siteUrl, setSiteUrl] = useState('https://ebox86.com');
  const shareMenuRef = useRef<HTMLDivElement | null>(null);
  const [flashTargets, setFlashTargets] = useState({
    name: false,
    email: false,
    message: false,
  });
  const hasCaptcha = Boolean(captchaSiteKey);
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const fallbackLinks: ContactLink[] = [
    {
      label: 'Connect on LinkedIn',
      url: 'https://www.linkedin.com/in/evan-kohout/',
      icon: 'linkedin',
      linkType: 'social',
      tooltip: 'Connect on LinkedIn',
    },
    {
      label: 'Follow on X',
      url: 'https://twitter.com/ebox86',
      icon: 'x',
      linkType: 'social',
      tooltip: 'Follow on X',
    },
    {
      label: 'View GitHub',
      url: 'https://github.com/ebox86',
      icon: 'github',
      linkType: 'social',
      tooltip: 'View GitHub',
    },
    {
      label: 'Download Resume',
      url: '/resume.pdf',
      icon: 'resume',
      linkType: 'resume',
      tooltip: 'Download Resume',
    },
    {
      label: 'Share this site',
      icon: 'share',
      linkType: 'share',
      shareSubject: 'Take a look at this portfolio',
      shareBody: 'Thought you might like this portfolio:',
      tooltip: 'Share this site',
    },
  ];

  const normalizedLinks: ContactLink[] = (contactLinks || []).map((link) => ({
    ...link,
    linkType: (link.linkType as ContactLink['linkType']) || 'social',
    tooltip: link.tooltip ?? link.label ?? '',
  }));

  const shareLink = normalizedLinks.find((link) => link.linkType === 'share');
  const shareMailSubject = shareLink?.shareSubject || 'Take a look at this portfolio';
  const shareMailBody = shareLink?.shareBody || 'Thought you might like this portfolio:';
  const resumeLink = normalizedLinks.find((link) => link.linkType === 'resume');
  const displayLinks = normalizedLinks;
  const mailBodyWithUrl = `${shareMailBody || ''}${shareMailBody?.endsWith('\n') ? '' : '\n\n'}${siteUrl}`;

  const renderIcon = (iconKey?: string, size = 40) => {
    const key = iconKey?.toLowerCase();
    switch (key) {
      case 'linkedin':
        return <FaLinkedin size={size} />;
      case 'x':
      case 'twitter':
        return <RiTwitterXFill size={size} />;
      case 'github':
        return <FaGithub size={size} />;
      case 'resume':
      case 'download':
        return <FaDownload size={size} />;
      case 'share':
        return <RiShareForwardLine size={size - 4} />;
      case 'mail':
        return <RiMailLine size={size - 6} />;
      case 'copy':
        return <FiClipboard size={size - 8} />;
      case 'link':
        return <FiLink size={size - 6} />;
      default:
        return <RiShareForwardLine size={size - 4} />;
    }
  };

  const formatResumeUpdated = (iso?: string | null) => {
    if (!iso) return '';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (!feedbackMessage || isSuccess) return;
    const timer = setTimeout(() => {
      setFeedbackMessage('');
    }, 20000);
    return () => clearTimeout(timer);
  }, [feedbackMessage, isSuccess]);

  useEffect(() => {
    let cancelled = false;

    const fetchCaptchaKey = async () => {
      try {
        const res = await fetch('/api/captcha-sitekey');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.siteKey) {
          setCaptchaSiteKey(data.siteKey);
        }
      } catch (error) {
        // Fail silently; form will stay disabled without a captcha key.
      }
    };

    fetchCaptchaKey();
    return () => {
      cancelled = true;
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!shareStatus) return;
    const timer = setTimeout(() => setShareStatus(''), 2000);
    return () => clearTimeout(timer);
  }, [shareStatus]);

  useEffect(() => {
    if (!shareMenuOpen) return;
    const handleClickAway = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [shareMenuOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setShareStatus('Link copied!');
    } catch {
      setShareStatus('Could not copy, try again.');
    } finally {
      setShareMenuOpen(false);
    }
  };

  const onCaptchaChange = (token: any) => {
    setCaptchaToken(token);
  };
  

  const isFormValid = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = userMessage.trim();
    return (
      hasCaptcha &&
      Boolean(captchaToken) &&
      trimmedName.length > 0 &&
      validateEmail(trimmedEmail) &&
      trimmedMessage.length > 0 &&
      trimmedMessage.length <= 500
    );
  }, [captchaToken, email, hasCaptcha, name, userMessage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasCaptcha) {
      setFeedbackMessage('Contact form is disabled because the captcha key is missing.');
      return;
    }
  
    // Validation
    if (name.trim().length < 1) {
      setFeedbackMessage('Name is required.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setFeedbackMessage('Invalid email format.');
      return;
    }
    if (userMessage.trim().length < 1 || userMessage.trim().length > 500) {
      setFeedbackMessage('Message should be between 1 and 500 characters.');
      return;
    }
    if (!captchaToken) {
      setFeedbackMessage('Invalid captcha.');
      return;
    }
  
    setIsSending(true);
  
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: userMessage.trim(),
          captchaToken: captchaToken
        }),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      setIsSending(false);

      if (!response.ok) {
        const message = data?.message || `Request failed (${response.status})`;
        throw new Error(message);
      }

      if (data?.success) {
        setFeedbackMessage('Thanks for reaching out!');
        setIsSuccess(true);
        return;
      }

      throw new Error(data?.message || 'Something went wrong.');
    } catch (error) {
      setFeedbackMessage((error as any)?.message || 'Something went wrong.');
      setIsSuccess(false);
    }
  };

  const triggerFlash = () => {
    if (isSending || isSuccess || isFormValid) return;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = userMessage.trim();
    setFlashTargets({
      name: trimmedName.length === 0,
      email: !validateEmail(trimmedEmail),
      message: trimmedMessage.length === 0 || trimmedMessage.length > 500,
    });
    setTimeout(() => {
      setFlashTargets({ name: false, email: false, message: false });
    }, 650);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Contact Form Column */}
      <div className="md:flex-1 relative">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Let&apos;s Connect</h1>
        {contactSubheading && (
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
            {contactSubheading}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 p-3 w-full border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 dark:disabled:bg-gray-800 dark:disabled:border-gray-600 dark:disabled:text-gray-400 ${
                flashTargets.name ? 'animate-flash-border ring-2 ring-red-500' : ''
              }`}
              placeholder="Your Name"
              disabled={isSuccess ? true : false}
            />
          </div>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 p-3 w-full border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 dark:disabled:bg-gray-800 dark:disabled:border-gray-600 dark:disabled:text-gray-400 ${
                flashTargets.email ? 'animate-flash-border ring-2 ring-red-500' : ''
              }`}
              placeholder="Your Email"
              disabled={isSuccess ? true : false}
            />
          </div>
          {/* Message Field */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              rows={4}
              className={`mt-1 p-3 w-full border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 dark:disabled:bg-gray-800 dark:disabled:border-gray-600 dark:disabled:text-gray-400 ${
                flashTargets.message ? 'animate-flash-border ring-2 ring-red-500' : ''
              }`}
              placeholder="Your Message"
              disabled={isSuccess ? true : false}
            />
              <p className="text-right mt-1">
                <span className={`text-xs ${userMessage.length > 500 ? 'text-red-600' : 'text-gray-600'}`}>
                  {userMessage.length}
                </span>
                <span className="text-xs text-gray-600">
                  /500
                </span>
              </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md min-h-[110px] flex items-center justify-center rounded-md border border-transparent dark:border-transparent">
              {hasCaptcha ? (
                <div className={`${captchaReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                  <HCaptcha
                    sitekey={captchaSiteKey}
                    onVerify={onCaptchaChange}
                    onLoad={() => setCaptchaReady(true)}
                    theme={isDark ? 'dark' : 'light'}
                  />
                </div>
              ) : (
                <div className="text-sm text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded">
                  Captcha key missing; contact form disabled in this environment.
                </div>
              )}
            </div>
          </div>
          <div className="text-center m-4">
            <div
              className="inline-block relative group"
              onMouseEnter={triggerFlash}
            >
            <button
              type="submit"
              className={`relative py-3 px-6 text-lg rounded-md text-white transition ${
                isSending || isSuccess || !isFormValid
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
              }`}
              disabled={isSending || isSuccess || !isFormValid}
            >
              ✉️ Send
            </button>
            {!isSuccess && !isSending && !isFormValid && (
              <span className="pointer-events-none absolute left-full bottom-full mb-1 ml-1 w-64 rounded-md bg-yellow-50 border-2 border-black px-3 py-2 text-base font-semibold text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition">
                Complete required fields and captcha to enable Send.
              </span>
            )}
            </div>
          </div>
          {feedbackMessage && (
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2
              ${isSuccess === null ? '' : 'bg-opacity-50'}
              ${isSuccess ? 'bg-green-100 border-green-700 dark:bg-green-900/70 dark:border-green-400' : 'bg-red-100 border-red-700 dark:bg-red-900/70 dark:border-red-400'}
              border rounded-lg`}
              style={{ zIndex: 30 }}
            >
              {!isSuccess && (
                <button
                  className={`absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 ${isSuccess ? 'text-green-500 hover:text-green-700 border-green-700' : 'text-red-500 hover:text-red-700 border-red-700 dark:text-red-200 dark:border-red-300 dark:hover:text-red-100'} bg-white dark:bg-gray-800 border rounded-full p-0.5`}
                  onClick={() => setFeedbackMessage('')}
                >
                  <RiCloseLine size={16} />
                </button>
              )}
              <p className={`text-md ${isSuccess ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}>{feedbackMessage}</p>
            </div>
          )}
          {isSuccess && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gray-100/70 dark:bg-gray-900/60 z-10"
            />
          )}
        </form>
      </div>
      {/* Social Links Column */}
      <div className="md:w-24 p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-center items-center dark:bg-gray-800 dark:border-gray-700">
        <div className="social-media-section">
          <div className="social-icons flex flex-row md:flex-col items-center">
            {displayLinks.map((link, idx) => {
              const tooltipLabel = link.tooltip || '';
              if (link.linkType === 'share') {
                return (
                  <div
                    key={`share-${idx}`}
                    className="relative group flex flex-col items-center"
                    ref={shareMenuRef}
                    onMouseLeave={() => setShareMenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setShareMenuOpen((open) => !open)}
                      className="flex items-center justify-center text-4xl text-gray-800 hover:text-gray-600 dark:text-white dark:hover:text-gray-200 p-4 transform transition duration-200 hover:scale-110 hover:shadow-lg rounded-full leading-none hover:bg-indigo-50 dark:hover:bg-gray-700"
                      aria-label={link.label || tooltipLabel || 'Share this site'}
                    >
                      {renderIcon(link.icon || 'share', 36)}
                    </button>
                    {tooltipLabel && (
                      <span
                        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full -mb-3 w-max max-w-[160px] rounded-md bg-yellow-50 border-2 border-black px-3 py-2 text-base font-semibold text-gray-900 shadow-xl hidden md:block md:opacity-0 md:group-hover:opacity-100 transition ${shareMenuOpen ? 'md:hidden' : ''}`}
                      >
                        {tooltipLabel}
                      </span>
                    )}
                    {shareMenuOpen && (
                      <div className="absolute bottom-full mb-0 left-1/2 -translate-x-1/2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                        >
                          <FiClipboard size={16} />
                          Copy site link
                        </button>
                        <a
                          href={`mailto:?subject=${encodeURIComponent(shareMailSubject)}&body=${encodeURIComponent(mailBodyWithUrl)}`}
                          className="block px-4 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                          onClick={() => setShareMenuOpen(false)}
                        >
                          <RiMailLine size={16} />
                          Email this page
                        </a>
                      </div>
                    )}
                  </div>
                );
              }

              if (link.linkType === 'resume') {
                const resumeUrl = link.resumeFileUrl || link.url || '/resume.pdf';
                return (
                  <div key={`resume-${idx}`} className="relative group flex flex-col items-center">
                    <a
                      href={resumeUrl}
                      download
                      className="flex items-center justify-center text-4xl text-gray-800 hover:text-gray-600 dark:text-white dark:hover:text-gray-200 p-4 transform transition duration-200 hover:scale-110 hover:shadow-lg rounded-full leading-none hover:bg-indigo-50 dark:hover:bg-gray-700"
                      aria-label={link.label || tooltipLabel || 'Download resume'}
                    >
                      {renderIcon(link.icon || 'resume', 40)}
                    </a>
                    {tooltipLabel && (
                      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full -mb-3 w-max max-w-[200px] rounded-md bg-yellow-50 border-2 border-black px-3 py-2 text-base font-semibold text-gray-900 shadow-xl opacity-0 transition hidden md:block md:group-hover:opacity-100">
                        <span className="block">{tooltipLabel}</span>
                        {formatResumeUpdated(link.resumeUpdatedAt) && (
                          <span className="block text-xs text-gray-700 mt-0.5">
                            Updated: {formatResumeUpdated(link.resumeUpdatedAt)}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div key={`social-${idx}`} className="relative group flex flex-col items-center">
                  <a
                    href={link.url || '#'}
                    className="flex items-center justify-center text-4xl text-gray-800 hover:text-gray-600 dark:text-white dark:hover:text-gray-200 p-4 transform transition duration-200 hover:scale-110 hover:shadow-lg rounded-full leading-none hover:bg-indigo-50 dark:hover:bg-gray-700"
                    aria-label={link.label || tooltipLabel || 'Social link'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {renderIcon(link.icon || 'link', 40)}
                  </a>
                  {tooltipLabel && (
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full -mb-3 w-max max-w-[160px] rounded-md bg-yellow-50 border-2 border-black px-3 py-2 text-base font-semibold text-gray-900 shadow-xl opacity-0 transition hidden md:block md:group-hover:opacity-100">
                      {tooltipLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {shareStatus && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 text-white px-4 py-3 shadow-2xl flex items-center gap-2 text-sm">
          <FiClipboard size={16} />
          {shareStatus}
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  try {
    const data = await client.fetch(
      `*[_type == "contactSettings"][0]{
        subheading,
        socialLinks[]{
          label,
          tooltip,
          url,
          icon,
          linkType,
          shareSubject,
          shareBody,
          resumeFile{
            asset->{url,_updatedAt,_createdAt}
          }
        }
      }`
    );

    const links: ContactLink[] =
      data?.socialLinks?.map((link: any) => ({
        ...link,
        resumeFileUrl: link?.resumeFile?.asset?.url || null,
        tooltip: link?.tooltip ?? '',
        resumeUpdatedAt: link?.resumeFile?.asset?._updatedAt || link?.resumeFile?.asset?._createdAt || null,
      })) || [];

    return {
      props: {
        contactSubheading: data?.subheading || null,
        contactLinks: links,
      },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: {
        contactSubheading: null,
        contactLinks: [],
      },
      revalidate: 3600,
    };
  }
};

export default ContactPage;
