import imageUrlBuilder from '@sanity/image-url';
import client from '../../sanityClient';

type BuildOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

const builder = imageUrlBuilder(client);

export type BuiltImage = {
  url: string;
  blurDataURL?: string;
  objectPosition?: string;
  width?: number;
  height?: number;
};

export const buildSanityImage = (img: any, options?: BuildOptions): BuiltImage | null => {
  if (!img) return null;

  const hasRef = Boolean(img?.asset?._ref);
  const baseBuilder = hasRef ? builder.image(img) : null;

  let sized = baseBuilder ? baseBuilder.auto('format') : null;
  if (sized && typeof options?.width === 'number') sized = sized.width(options.width);
  if (sized && typeof options?.height === 'number') sized = sized.height(options.height);
  if (sized && typeof options?.quality === 'number') sized = sized.quality(options.quality);

  const url = sized?.url() || img?.asset?.url;
  if (!url) return null;

  const dims = img?.asset?.metadata?.dimensions;
  const width = typeof dims?.width === 'number' ? dims.width : undefined;
  const height = typeof dims?.height === 'number' ? dims.height : undefined;

  const hotspot = img?.hotspot;
  const objectPosition = hotspot
    ? `${(hotspot.x ?? 0.5) * 100}% ${(hotspot.y ?? 0.5) * 100}%`
    : 'center';

  return {
    url,
    blurDataURL: img?.asset?.metadata?.lqip || null,
    objectPosition,
    width,
    height,
  };
};
