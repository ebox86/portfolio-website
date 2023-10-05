// src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container mx-auto px-4"> {/* Added px-4 for horizontal padding */}
        <p className="text-xs">&copy; 2023 Evan Kohout. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
