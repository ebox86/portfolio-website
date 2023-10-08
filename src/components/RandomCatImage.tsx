import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RandomCatImage: React.FC = () => {
  const [catImage, setCatImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomCatImage = async () => {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
          headers: {
            'x-api-key': process.env.CAT_API_KEY,
          },
        });
        if (response.data && response.data.length > 0) {
          setCatImage(response.data[0].url);
        }
      } catch (error) {
        console.error('Error fetching cat image:', error);
      }
    };

    fetchRandomCatImage();
  }, []);

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
