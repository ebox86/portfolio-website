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
  featuredProject?: {
    title: string;
    summary?: string;
    slug: string;
    repo?: string;
    live?: string;
    category?: {
      emoji?: string;
      title?: string;
      gradientStart?: string;
      gradientEnd?: string;
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

const Home: React.FC<HomePageProps> = ({ initialData, hero, featuredProject }) => {
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
  const featuredBadge = 'Featured Project';

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
          {featuredProject && <div className="mt-6 mb-5 w-full border-t border-gray-200 dark:border-gray-700" />}
        </div>
        <div className="w-full md:w-2/6 md:float-left p-4 hidden md:block">
          <Avatar src={headshotSrc} blurDataURL={headshotBlur} />
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>

      {featuredProject && (
        <div className="mt-0 mb-6 w-full">
          <div className="flex flex-col gap-0.5 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">{featuredBadge}</span>
            </div>
            <div className="space-y-[6px]">
              <h3 className="text-xl font-semibold leading-tight text-gray-900 dark:text-white">{featuredProject.title}</h3>
              {featuredProject.summary && <p className="text-sm text-gray-700 dark:text-gray-200">{featuredProject.summary}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/projects/${encodeURIComponent(featuredProject.slug)}`}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              >
                <span aria-hidden>📄</span> View details
              </Link>
              {featuredProject.live && (
                <a
                  href={featuredProject.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                >
                  <span aria-hidden>🌐</span> View live
                </a>
              )}
              {featuredProject.repo && (
                <a
                  href={featuredProject.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.52 7.52 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View code
                </a>
              )}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-102 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
              >
                <span aria-hidden>🗂</span> View all projects
              </Link>
            </div>
          </div>
        </div>
      )}

      <hr className="mb-7 mt-1 border-gray-200 dark:border-gray-700" />

      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Here&apos;s a cat 👇
      </p>

      <div className="w-full md:w-2/3 md:float-left relative">
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
            style={{ bottom: '25px', right: '70px', zIndex: 1, position: 'absolute' }}
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
            style={{ bottom: '25px', right: '30px', zIndex: 1, position: 'absolute' }}
            title="Thumbs Down"
            disabled={!votingButtonsActive}
          >
            👎
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/3 md:float-left">
        <div className="hidden md:block md:-mt-12 p-5 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">Blog</h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
          <ul className="space-y-4">
            {initialData.map(({ _id, title = '', slug = '' }, index) => (
              <li key={_id}>
                <Link href={`/blog/${encodeURIComponent(slug.current)}`}>
                  <p className="text-base font-medium">{title}</p>
                  <p className="text-sm text-gray-400">{formattedDates[index]}</p>
                </Link>
                {index !== initialData.length - 1 && <hr className="my-4" />}
              </li>
            ))}
          </ul>
          <div className="pt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-102 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
            >
              <span aria-hidden>📰</span> View all posts
            </Link>
          </div>
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
  const featuredProjectQuery = `*[_type == "project" && featured == true][0]{
    title,
    summary,
    "slug": slug.current,
    links,
    category->{
      title,
      emoji,
      "gradientStart": gradientStart.hex,
      "gradientEnd": gradientEnd.hex
    }
  }`;

  const [recentPosts, hero, featuredProject] = await Promise.all([
    client.fetch<BlogPost[]>(postsQuery),
    client.fetch(heroQuery),
    client.fetch(featuredProjectQuery),
  ]);

  return {
    props: {
      initialData: recentPosts,
      hero: hero || null,
      featuredProject: featuredProject
        ? {
            title: featuredProject.title,
            summary: featuredProject.summary,
            slug: featuredProject.slug,
            repo: featuredProject.links?.repo || null,
            live: featuredProject.links?.live || null,
            category: featuredProject.category || null,
          }
        : null,
    },
    revalidate: 600 // 10 min
  };
};

export default Home;
