import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import useSWR from 'swr';
import RandomCatImage from '@/components/RandomCatImage';
import Avatar from '@/components/Avatar';
import axios from 'axios';

interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
}

interface HomePageProps {
  initialData: BlogPost[];
  hero: {
    heroTitle?: string;
    heroSubtitle?: string;
    pronouns?: string;
    location?: string;
    headshot?: {
      asset?: {
        url?: string;
        metadata?: {
          lqip?: string;
        };
      };
    };
  } | null;
}

type CatImageData = {
  url: string;
  width: number;
  height: number;
  id: string;
};

const fetcher = (query: string) => client.fetch<BlogPost[]>(query);

const Home: React.FC<HomePageProps> = ({ initialData, hero }) => {
  const router = useRouter();
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<CatImageData | null>(null);
  const [nextImage, setNextImage] = useState<CatImageData | null>(null);
  const [votingButtonsActive, setVotingButtonsActive] = useState(true);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);

  const headshotSrc = hero?.headshot?.asset?.url || '/images/headshot.png';
  const headshotBlur = hero?.headshot?.asset?.metadata?.lqip;
  const heroTitle = hero?.heroTitle || "👋 Hey, I'm Evan";
  const heroSubtitle = hero?.heroSubtitle || 'Engineer. Traveler. Thinker. Creator.';
  const pronouns = hero?.pronouns || 'He/him';
  const location = hero?.location || 'Seattle, WA';

  const query = `*[_type == "post"] | order(publishedAt desc) [0..2] {
    _id,
    title,
    slug,
    publishedAt
  }`;
  const { data: posts = initialData } = useSWR(query, fetcher, {
    initialData,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    const formattedDatesArray = posts.map(({ publishedAt }) => {
      return new Date(publishedAt).toDateString();
    });
    setFormattedDates(formattedDatesArray);
  }, [posts]);

  const fetchCatImages = useCallback(async () => {
    try {
      const isImageFromApprovedDomain = (url: string) => url.includes('.thecatapi.com');

      // Fetch only one image if there's already a currentImage, else fetch 2 images
      const limit = currentImage ? 1 : 2;
      const response = await axios.get(`/api/getCats?limit=${limit}`);
      
      if (limit === 1) {
        // We're fetching only one new image for preloading
        if (!isImageFromApprovedDomain(response.data[0].url)) {
          console.warn("Image from unapproved domain detected. Fetching another.");
          fetchCatImages();
          return;
        }

        setNextImage({
          url: response.data[0].url,
          width: response.data[0].width,
          height: response.data[0].height,
          id: response.data[0].id
        });
      } else {
        // Initial load, set the currentImage and nextImage
        if (!isImageFromApprovedDomain(response.data[0].url) || !isImageFromApprovedDomain(response.data[1].url)) {
          console.warn("Image from unapproved domain detected. Fetching another.");
          fetchCatImages();
          return;
        }
        
        setCurrentImage({
          url: response.data[0].url,
          width: response.data[0].width,
          height: response.data[0].height,
          id: response.data[0].id
        });
        setNextImage({
          url: response.data[1].url,
          width: response.data[1].width,
          height: response.data[1].height,
          id: response.data[1].id
        });
      }
    } catch (error: any) {
      console.error("Error fetching cat images:", error);
      if (error.response && error.response.status === 429) {
        console.error("Rate limit reached. Displaying fallback image.");
        setFallbackImage("https://http.cat/429");
        setVotingButtonsActive(false);
      } 
    }
  }, [currentImage]);
  
  

  useEffect(() => {
    fetchCatImages();
  }, [fetchCatImages]);

  
  const handleVote = async (value: number) => {
    try {
      if (!currentImage) {
        console.error('No cat image loaded.');
        return;
      }
    
      setVotingButtonsActive(false); // Disable buttons during the vote
  
      const response = await axios.post('/api/voteCat', {
        image_id: currentImage.id,
        value: value,
      });
  
      // Show the preloaded image immediately
      setCurrentImage(nextImage);
      setNextImage(null);
  
      // Fetch two new images in the background
      fetchCatImages();
  
      setVotingButtonsActive(true);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  
  return (
      <div className="w-full">
        <div>
          <div className="pt-4 md:pt-2 pb-2 w-full md:w-4/6 md:float-left relative text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-3 md:mb-3">{heroTitle}</h1>
          <p className="text-gray-700 dark:text-gray-200 text-xl mb-3 md:mb-4">
            {heroSubtitle}
          </p>
          <p className="mb-4 md:mb-5">
            💁🏻‍♂️ {pronouns}   📍 {location}
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <button 
              onClick={() => router.push('/me')}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 m-2 md:text-left text-center inline-block transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
            >
              ☕ Get to know me
            </button>
            <button 
              onClick={() => router.push('/contact')}
              className="m-2 md:text-left text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
            >
              📞 Get in touch
            </button>
          </div>
          <div className="mt-6 mb-5 w-full border-t border-gray-200 dark:border-gray-700" />
          <p className="text-gray-700 dark:text-gray-200 mt-4">
            Here&apos;s a cat 👇
          </p>
        </div>
        <div className="w-full md:w-2/6 md:float-left p-4 hidden md:block">
          <Avatar src={headshotSrc} blurDataURL={headshotBlur} />
        </div>
      </div>
      <div className="w-full md:w-4/5 md:float-left relative">
      <RandomCatImage 
        currentImage={fallbackImage || currentImage?.url}
        imageWidth={currentImage?.width}
        imageHeight={currentImage?.height}
        nextImage={nextImage?.url}
      />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => handleVote(1)}
            className={`bg-white rounded-full p-2 shadow-md hover:shadow-lg transform hover:scale-110 transition duration-300 ${
              !votingButtonsActive && 'bg-gray-400 cursor-not-allowed'
            }`}
            style={{ bottom: '25px', right: '50px', zIndex: 1, position: 'absolute' }}
            title="Thumbs Up"
            disabled={!votingButtonsActive}
          >
            👍
          </button>
          <button
            onClick={() => handleVote(-1)}
            className={`bg-white rounded-full p-2 shadow-md hover:shadow-lg transform hover:scale-110 transition duration-300 ${
              !votingButtonsActive && 'bg-gray-400 cursor-not-allowed'
            }`}
            style={{ bottom: '25px', right: '10px', zIndex: 1, position: 'absolute' }}
            title="Thumbs Down"
            disabled={!votingButtonsActive}
          >
            👎
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/5 md:float-left">
        <div className="p-4 hidden md:block">
          <h2 className="text-md font-semibold text-gray-800 dark:text-white mb-4">Recent Posts</h2>
          <ul className="space-y-4">
            {initialData.map(({ _id, title = '', slug = '' }, index) => (
              <li key={_id}>
                <Link href={`/blog/${encodeURIComponent(slug.current)}`}>
                  <p className="text-sm">{title}</p>
                  <p className="text-xs text-gray-400">{formattedDates[index]}</p>
                </Link>
                {index !== initialData.length - 1 && <hr className="my-4" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const postsQuery = `*[_type == "post"] | order(publishedAt desc) [0..2] {
    _id,
    title,
    slug,
    publishedAt
  }`;
  const heroQuery = `*[_type == "homeSettings"][0]{
    heroTitle,
    heroSubtitle,
    pronouns,
    location,
    headshot{
      asset->{
        url,
        metadata{
          lqip
        }
      }
    }
  }`;

  const [recentPosts, hero] = await Promise.all([
    client.fetch<BlogPost[]>(postsQuery),
    client.fetch(heroQuery),
  ]);

  return {
    props: {
      initialData: recentPosts,
      hero: hero || null,
    },
    revalidate: 600 // 10 min
  };
};

export default Home;
