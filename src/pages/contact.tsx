import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';


const ContactPage = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Contact Form Column */}
      <div className="md:flex-1 p-4">
        <h1 className="text-3xl font-semibold mb-4">Lets Connect</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Message"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              disabled
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Social Links Column */}
      <div className="md:w-24 p-4 bg-gray-200 rounded-lg flex flex-col justify-center items-center md:ml-4 md:mt-0">
        <div className="social-media-section">
          {/* Use flex classes to control layout */}
          <div className="social-icons flex flex-row md:flex-col">
            <a href="https://www.linkedin.com/in/evan-kohout/" className="text-4xl text-blue-600 hover:text-blue-800 p-4">
              <FaLinkedin size={40} />
            </a>
            <a href="https://twitter.com/ebox86" className="text-4xl text-twitter-blue hover:text-twitter-dark-blue p-4">
              <FaTwitter size={40} />
            </a>
            <a href="https://github.com/ebox86" className="text-4xl text-github hover:text-dark-gray p-4">
              <FaGithub size={40} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
