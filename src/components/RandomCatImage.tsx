import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RandomCatImageProps {
  currentImage?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  nextImage?: string | null;
}

const RandomCatImage: React.FC<RandomCatImageProps> = ({ currentImage, imageWidth, imageHeight, nextImage }) => {
  return (
    <div className="mb-4 relative max-w-[480px] md:max-w-[480px] mr-auto">
      {!currentImage ? (
        <div className="relative rounded-xl p-[3px] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-700 overflow-hidden">
          <div className="relative h-64 rounded-[10px] overflow-hidden bg-white">
            <Image
              src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
              alt="Loading cat"
              fill
              className="object-cover"
              priority
              unoptimized
              sizes="(max-width: 768px) 90vw, 400px"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="relative rounded-xl p-[3px] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-700 overflow-hidden">
            <div className="rounded-[10px] overflow-hidden bg-white">
              <Image
                src={currentImage}
                alt="Random Cat"
                width={imageWidth || 480}
                height={imageHeight || 480}
                priority
                className="h-auto w-full rounded-lg shadow-md"
                sizes="(max-width: 768px) 90vw, 480px"
              />
            </div>
          </div>
          {/* Caption */}
          <div className="absolute md:bottom-2 bottom-2 left-2 bg-gray-100 bg-opacity-80 text-gray-800 px-2 py-1 rounded-md text-[10px] leading-tight shadow-sm">
            Cat pics provided by https://thecatapi.com/
          </div>
          {/* Preloading the next image */}
          {nextImage && (
            <Image
              src={nextImage}
              alt="Preload Next Cat"
              width={10}
              height={10}
              priority
              className="pointer-events-none opacity-0 absolute"
              sizes="10px"
            />
          )}
        </>
      )}
    </div>
  );
};

export default RandomCatImage;
