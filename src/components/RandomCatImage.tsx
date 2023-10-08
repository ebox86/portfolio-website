import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RandomCatImageProps {
  onImageLoad: (image: string) => void;
}

const RandomCatImage: React.FC<RandomCatImageProps> = ({ onImageLoad }) => {
  const [catImage, setCatImage] = useState<string | null>(null);
  const [shouldFetchImage, setShouldFetchImage] = useState(true);

  useEffect(() => {
    if (shouldFetchImage) {
      const fetchRandomCatImage = async () => {
        try {
          const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY,
              'Access-Control-Allow-Origin': '*',
            },
          });
          if (response.data && response.data.length > 0) {
            const imageUrl = response.data[0].url;
            setCatImage(imageUrl);
            onImageLoad(imageUrl); // Call the onImageLoad callback with the image URL
          }
        } catch (error) {
          console.error('Error fetching cat image:', error);
        }
      };

      fetchRandomCatImage();
      setShouldFetchImage(false); // Prevent further image fetching until needed again
    }
  }, [onImageLoad, shouldFetchImage]);

  return (
    <div className="mb-4">
      {catImage && (
        <img
          src={catImage}
          alt="Random Cat"
          className="w-full rounded-lg shadow-md"
          style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
};

export default RandomCatImage;
