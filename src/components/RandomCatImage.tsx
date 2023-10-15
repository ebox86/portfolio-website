import React from 'react';
import Image from "next/legacy/image";

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
        <div className="loading-spinner">Loading...</div>
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
          {/* Preloading the next image */}
          {nextImage && <img src={nextImage} alt="Preload Next Cat" width="0" height="0" />}
        </>
      )}
    </div>
  );
};

export default RandomCatImage;
