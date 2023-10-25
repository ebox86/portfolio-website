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
}

type CatImageData = {
  url: string;
  width: number;
  height: number;
  id: string;
};

const fetcher = (query: string) => client.fetch<BlogPost[]>(query);

const Home: React.FC<HomePageProps> = ({ initialData }) => {
  const router = useRouter();
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<CatImageData | null>(null);
  const [nextImage, setNextImage] = useState<CatImageData | null>(null);
  const [votingButtonsActive, setVotingButtonsActive] = useState(true);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);

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
      // Fetch only one image if there's already a currentImage, else fetch 2 images
      const limit = currentImage ? 1 : 2;
      const response = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${process.env.NEXT_PUBLIC_CAT_API_KEY}`);
      
      if (limit === 1) {
        // We're fetching only one new image for preloading
        setNextImage({
          url: response.data[0].url,
          width: response.data[0].width,
          height: response.data[0].height,
          id: response.data[0].id
        });
      } else {
        // Initial load, set the currentImage and nextImage
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
  
      const response = await axios.post(
        `https://api.thecatapi.com/v1/votes?api_key=${process.env.NEXT_PUBLIC_CAT_API_KEY}`,
        {
          image_id: currentImage.id,
          value: value,
        }
      );
  
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
      <div className="container mx-auto max-w-screen-md">
        <div>
          <div className="pt-6 pb-2 w-full md:w-4/6 md:float-left relative text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800">👋 Hey, I&apos;m Evan</h1>
          <p className="text-gray-700 py-2">
            Engineer. Traveler. Thinker. Creator.
          </p>
          <div className="flex flex-col md:flex-row md:items-center">
            <button 
              onClick={() => router.push('/me')}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 m-2 md:text-left text-center inline-block"
            >
              ☕ Get to know me
            </button>
            <button 
              onClick={() => router.push('/contact')}
              className="m-2 md:text-left text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              📞 Get in touch
            </button>
          </div>
          <br />
          <p className="text-gray-700">
            Here&apos;s a cat 👇
          </p>
        </div>
        <div className="w-full md:w-2/6 md:float-left p-4 hidden md:block">
          <Avatar src={`/images/headshot.png`} />
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
          <h2 className="text-md font-semibold text-gray-800 mb-4">Recent Posts</h2>
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
  const query = `*[_type == "post"] | order(publishedAt desc) [0..2] {
    _id,
    title,
    slug,
    publishedAt
  }`;

  const recentPosts = await client.fetch<BlogPost[]>(query);

  return {
    props: {
      initialData: recentPosts,
    },
    revalidate: 600 // 10 min
  };
};

export default Home;
