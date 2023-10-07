import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200">
      <div className="py-8 max-w-screen-md mx-auto flex justify-between items-center flex-col md:flex-row px-4">
        <p className="text-xs">&copy; 2023 Evan Kohout. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
