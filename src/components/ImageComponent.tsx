import React from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import client from '../../sanityClient';  // adjust the path accordingly

const builder = imageUrlBuilder(client);

interface ImageComponentProps {
  value: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
}

const ImageComponent: React.FC<ImageComponentProps> = ({ value }) => {
  const imageUrl = builder.image(value).width(800).quality(80).url();
  const blurUrl = builder.image(value).width(20).quality(20).url(); // Low-quality blurred image

  return (
    <div className="w-full h-96 relative rounded-lg shadow-md mb-4 overflow-hidden">
      <Image
        src={imageUrl}
        alt={value.alt || ' '}
        layout="fill"
        objectFit="cover"
        placeholder="blur"
        blurDataURL={blurUrl}
      />
    </div>
  );
}

export default ImageComponent;
