import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image'

interface RandomCatImageProps {
  onImageLoad: (image: string) => void;
}

const RandomCatImage: React.FC<RandomCatImageProps> = ({ onImageLoad }) => {
  const [catImage, setCatImage] = useState<string | null>(null);
  const [shouldFetchImage, setShouldFetchImage] = useState(true);
  const [imageWidth, setImageWidth] = useState<number | `${number}` | undefined>(0); // Default to 0
  const [imageHeight, setImageHeight] = useState<number | `${number}` | undefined>(0); // Default to 0

  useEffect(() => {
    if (shouldFetchImage) {
      const fetchRandomCatImage = async () => {
        try {
          const response = await axios.get(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.NEXT_PUBLIC_CAT_API_KEY}`);
          if (response.data && response.data.length > 0) {
            const imageUrl = response.data[0].url;
            setCatImage(imageUrl);
            onImageLoad(imageUrl); // Call the onImageLoad callback with the image URL

            // Set image dimensions
            setImageWidth(response.data[0].width);
            setImageHeight(response.data[0].height);
          }
        } catch (error) {
          console.error('Error fetching cat image:', error);
        }
      };

      fetchRandomCatImage();
      setShouldFetchImage(false); // Prevent further image fetching until needed again
    }
  }, [onImageLoad, shouldFetchImage]);
console.log({imageWidth})
  return (
    <div className="mb-4">
      {catImage && (
        <Image
            src={catImage}
            alt="Random Cat"
            width={imageWidth}
            height={imageHeight}
            className="w-full rounded-lg shadow-md"
            style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
};

export default RandomCatImage;
