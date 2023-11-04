"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { RiTwitterXFill, RiCloseLine } from 'react-icons/ri';
import HCaptcha from "@hcaptcha/react-hcaptcha";

const Page = () => {
    console.log("contact page rendered")
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('use effect called')
    let timer: NodeJS.Timeout;
    if (feedbackMessage) {
      timer = setTimeout(() => {
        setFeedbackMessage('');
        //setIsSuccess(null);
      }, 20000);
    }
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const validateEmail = (email: string) => {

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const onCaptchaChange = (token: any) => {
        setCaptchaToken(token);
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
  
        // Validation
        let valid = true;
        if (name.trim().length < 1) {
            setFeedbackMessage('Name is required.');
            valid = false;
        } else if (!validateEmail(email)) {
            setFeedbackMessage('Invalid email format.');
            valid = false;
        } else if (userMessage.length < 1 || userMessage.length > 500) {
            setFeedbackMessage('Message should be between 1 and 500 characters.');
            valid = false;
        } else if (!captchaToken) {
            setFeedbackMessage('Invalid captcha.');
            valid = false;
        }

        if (!valid) return;

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

            const data = await response.json();
            setIsSending(false);
            if (data.success) {
            setFeedbackMessage('Thanks for reaching out!');
            setIsSuccess(true);
            } else {
            throw new Error(data.message);
            }
        } catch (error) {
            setFeedbackMessage((error as any)?.message || 'Something went wrong.');
            setIsSuccess(false);
        }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Contact Form Column */}
      <div className="md:flex-1 p-4 relative">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Let&apos;s Connect</h1>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Name"
              disabled={isSuccess ? true : false}
            />
          </div>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Email"
              disabled={isSuccess ? true : false}
            />
          </div>
          {/* Message Field */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              rows={4}
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
          <div className="flex justify-center items-center">
              <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY || ''}
                  onVerify={onCaptchaChange}
              />
          </div>
          <div className="text-center m-4">
            <button
              type="submit"
              className={`py-2 px-4 bg-indigo-600 text-white rounded-md ${isSending || isSuccess ? '' : 'hover:bg-indigo-700'} focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              disabled={isSending || feedbackMessage !== '' || isSuccess ? true : false}
            >
              ✉️ Send
            </button>
          </div>
          {feedbackMessage && (
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2
              ${isSuccess === null ? '' : 'bg-opacity-50'}
              ${isSuccess ? 'bg-green-100 border-green-700' : 'bg-red-100 border-red-700'}
              border rounded-lg`}
              style={{ zIndex: 2 }}
            >
              <button
                className={`absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 ${isSuccess ? 'text-green-500 hover:text-green-700 border-green-700' : 'text-red-500 hover:text-red-700 border-red-700'} bg-white border rounded-full p-0.5`}
                onClick={() => setFeedbackMessage('')}
              >
                <RiCloseLine size={16} />
              </button>
              <p className={`text-md ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>{feedbackMessage}</p>
            </div>
          )}
        </form>
      </div>
      {/* Social Links Column */}
      <div className="md:w-24 p-4 bg-gray-200 rounded-lg flex flex-col justify-center items-center md:ml-4 md:mt-0">
        <div className="social-media-section">
          <div className="social-icons flex flex-row md:flex-col">
            <a href="https://www.linkedin.com/in/evan-kohout/" className="text-4xl text-blue-600 hover:text-blue-800 p-4">
              <FaLinkedin size={40} />
            </a>
            <a href="https://twitter.com/ebox86" className="text-4xl text-gray-800 hover:text-gray-500 p-4">
              <RiTwitterXFill size={40} />
            </a>
            <a href="https://github.com/ebox86" className="text-4xl text-gray-800 hover:text-gray-600 p-4">
              <FaGithub size={40} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
