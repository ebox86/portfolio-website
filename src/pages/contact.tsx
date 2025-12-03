import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { RiTwitterXFill, RiCloseLine } from 'react-icons/ri';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ThemeContext from '../context/ThemeContext';

const ContactPage = () => {
  const [captchaSiteKey, setCaptchaSiteKey] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [flashTargets, setFlashTargets] = useState({
    name: false,
    email: false,
    message: false,
  });
  const hasCaptcha = Boolean(captchaSiteKey);
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (feedbackMessage) {
      timer = setTimeout(() => {
        setFeedbackMessage('');
        //setIsSuccess(null);
      }, 20000);
    }
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

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
              className={`mt-1 p-3 w-full border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ${
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
              className={`mt-1 p-3 w-full border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ${
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
              className={`mt-1 p-3 w-full border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ${
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
          <div className="flex justify-center items-center rounded-md">
            {hasCaptcha ? (
              <HCaptcha
                sitekey={captchaSiteKey}
                onVerify={onCaptchaChange}
                theme={isDark ? 'dark' : 'light'}
              />
            ) : (
              <div className="text-sm text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded">
                Captcha key missing; contact form disabled in this environment.
              </div>
            )}
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
              style={{ zIndex: 2 }}
            >
              <button
                className={`absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 ${isSuccess ? 'text-green-500 hover:text-green-700 border-green-700' : 'text-red-500 hover:text-red-700 border-red-700 dark:text-red-200 dark:border-red-300 dark:hover:text-red-100'} bg-white dark:bg-gray-800 border rounded-full p-0.5`}
                onClick={() => setFeedbackMessage('')}
              >
                <RiCloseLine size={16} />
              </button>
              <p className={`text-md ${isSuccess ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}>{feedbackMessage}</p>
            </div>
          )}
        </form>
      </div>
      {/* Social Links Column */}
      <div className="md:w-24 p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-center items-center dark:bg-gray-800 dark:border-gray-700">
        <div className="social-media-section">
          <div className="social-icons flex flex-row md:flex-col">
            <a href="https://www.linkedin.com/in/evan-kohout/" className="text-4xl text-blue-600 hover:text-blue-800 dark:text-white dark:hover:text-gray-200 p-4 transform transition duration-200 hover:scale-110 hover:shadow-lg rounded-full">
              <FaLinkedin size={40} />
            </a>
            <a href="https://twitter.com/ebox86" className="text-4xl text-gray-800 hover:text-gray-500 dark:text-white dark:hover:text-gray-200 p-4 transform transition duration-200 hover:scale-110 hover:shadow-lg rounded-full">
              <RiTwitterXFill size={40} />
            </a>
            <a href="https://github.com/ebox86" className="text-4xl text-gray-800 hover:text-gray-600 dark:text-white dark:hover:text-gray-200 p-4 transform transition duration-200 hover:scale-110 hover:shadow-lg rounded-full">
              <FaGithub size={40} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
