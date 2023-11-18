"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RandomCatImage from '@/components/RandomCatImage';
import Avatar from '@/components/Avatar';

export interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
}

export interface HomePageProps {
  posts: BlogPost[];
}

export type CatImageData = {
  url: string;
  width: number;
  height: number;
  id: string;
};

const Home: React.FC<HomePageProps> = ({ posts }) => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState<CatImageData | null>(null);
  const [nextImage, setNextImage] = useState<CatImageData | null>(null);
  const [votingButtonsActive, setVotingButtonsActive] = useState(true);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const hasFetchedOnce = useRef(false);


  const setImage = (data: CatImageData[], index: number) => ({
    url: data[index].url,
    width: data[index].width,
    height: data[index].height,
    id: data[index].id
  });
  

  const fetchCatImages = useCallback(async (limit: number) => {
    if (isFetching) return;
    setIsFetching(true);
    
    try {
        const response = await fetch(`/api/getCats?limit=${limit}`);
        if (!response.ok) {
        throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        if (limit === 1) {
            setNextImage(setImage(data, 0));
        } else {
            setCurrentImage(setImage(data, 0));
            setNextImage(setImage(data, 1));
        }
    } catch (error: any) {
        console.error("Error fetching cat images:", error);
        if (error.response && error.response.status === 429) {
          console.error("Rate limit reached. Displaying fallback image.");
          setFallbackImage("https://http.cat/429");
          setVotingButtonsActive(false);
        }
      } finally {
        setIsFetching(false);
      }
    }, [isFetching]);
  

  const handleVote = async (value: number) => {
    try {
        if (!currentImage) {
            console.error('No cat image loaded.');
        return;
        }
        setVotingButtonsActive(false);
        const response = await fetch(
            '/api/voteCat', 
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        image_id: currentImage.id,
                        value,
                    }
                )
            }
        );
        if(!response.ok){
            throw new Error('failed to submit vote')
        }
        setCurrentImage(nextImage);
        setNextImage(null);
        fetchCatImages(1);
        setVotingButtonsActive(true);
    } catch (error) {
        console.error('Error voting:', error);
    }
    };
    
    useEffect(() => {
        if (currentImage === null && nextImage === null && !isFetching && !hasFetchedOnce.current) {
          hasFetchedOnce.current = true;
          fetchCatImages(2);
        }
        else if (currentImage !== null && nextImage === null && !isFetching) {
          fetchCatImages(1);
        }
      }, [fetchCatImages, currentImage, nextImage, isFetching]);

  return (
      <div className="container mx-auto max-w-screen-md">
        <div>
          <div className="pt-6 pb-2 w-full md:w-4/6 md:float-left relative text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">👋 Hey, I&apos;m Evan</h1>
          <p className="text-gray-700 py-1 text-xl">
            Engineer. Traveler. Thinker. Creator.
          </p>
          <p className="py-1">
            💁🏻‍♂️ He/him   📍 Seattle, WA
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
            {posts.map(({ _id, title = '', slug = '', publishedAt }, index) => (
              <li key={_id}>
                <Link href={`/blog/${encodeURIComponent(slug.current)}`}>
                  <p className="text-sm">{title}</p>
                  <p className="text-xs text-gray-400">{new Date(publishedAt).toLocaleDateString()}</p>
                </Link>
                {index !== posts.length - 1 && <hr className="my-4" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};

export default Home;
