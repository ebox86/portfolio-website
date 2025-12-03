import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';

interface RandomCatImageProps {
  currentImage?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  nextImage?: string | null;
}

const RandomCatImage: React.FC<RandomCatImageProps> = ({ currentImage, imageWidth, imageHeight, nextImage }) => {
  return (
    <div className="mb-4 relative">
      {!currentImage ? (
        <div className="relative rounded-xl p-[3px] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-700 overflow-hidden">
          <div className="rounded-[10px] overflow-hidden bg-white">
            <img
              src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
              alt="Loading cat"
              className="w-full h-64 object-cover"
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
                width={imageWidth || 500}
                height={imageHeight || 500}
                priority={true}
                layout='responsive'
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
          {/* Caption */}
          <div className="absolute md:bottom-2 bottom-2 left-2 bg-gray-100 bg-opacity-80 text-gray-800 px-2 py-1 rounded-md text-[10px] leading-tight shadow-sm">
            Cat pics provided by https://thecatapi.com/
          </div>
          {/* Preloading the next image */}
          {nextImage && <img src={nextImage} alt="Preload Next Cat" width="0" height="0" />}
        </>
      )}
    </div>
  );
};

export default RandomCatImage;
