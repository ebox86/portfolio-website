import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 px-6 md:px-10 border-t border-gray-800 bg-gray-900">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <p className="text-xs text-gray-200 text-center md:text-left">&copy; {year} Evan Kohout. Made with ❤️. All rights reserved.</p>
        <div className="flex items-center space-x-2 text-xs text-gray-300 mt-3 md:mt-0">
          <a href="/privacy" className="hover:text-white transition">Privacy</a>
          <span className="text-gray-500">|</span>
          <a href="/terms" className="hover:text-white transition">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
