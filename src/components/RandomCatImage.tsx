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
    <div className="mb-4">
      {!currentImage ? (
        <div className="loading-spinner" />
      ) : (
        <>
          {currentImage && (
            <Image
              src={currentImage}
              alt="Random Cat"
              width={imageWidth || 500}
              height={imageHeight || 500}
              priority={true}
              layout='responsive'
              className="rounded-lg shadow-md"
            />
          )}
          {/* Caption */}
          <div className="absolute md:bottom-0 -bottom-4 left-0 bg-white text-black p-2 rounded-tr-lg rounded-bl-lg rounded-br-lg text-xs">
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