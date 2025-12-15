import Image from 'next/image';
import React from 'react';

const CloudflareBadge: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400/20 shadow-lg shadow-amber-400/20">
    <Image
      src="/images/cloudflare.png"
      alt="Cloudflare logo"
      width={size}
      height={size}
      className="h-16 w-16 rounded-lg object-contain"
      priority
    />
  </div>
);

export default CloudflareBadge;
