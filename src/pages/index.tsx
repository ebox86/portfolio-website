import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import RandomCatImage from '../components/RandomCatImage';
import axios from 'axios';

interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
}

interface HomePageProps {
  recentPosts: BlogPost[];
}

const Home: React.FC<HomePageProps> = ({ recentPosts }) => {
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const [catImage, setCatImage] = useState<string | null>(null);
  const [votingButtonsActive, setVotingButtonsActive] = useState(true);
  const [catImageKey, setCatImageKey] = useState<string | null>(null); // State for the key

  useEffect(() => {
    const formattedDatesArray = recentPosts.map(({ publishedAt }) => {
      return new Date(publishedAt).toDateString();
    });
    setFormattedDates(formattedDatesArray);
  }, [recentPosts]);

  const handleVote = async (value: number) => {
    try {
      if (!catImage) {
        console.error('No cat image loaded.');
        return;
      }
  
      // Extract the image ID from the catImage URL
      const imageId = catImage.split('/').pop()?.split('.')[0]; // Extract the last segment of the URL
  
      setVotingButtonsActive(false); // Disable buttons during the vote
  
      const response = await axios.post(
        `https://api.thecatapi.com/v1/votes?api_key=${process.env.NEXT_PUBLIC_CAT_API_KEY}`,
        {
          image_id: imageId,
          value: value,
        }
      );
  
      console.log(response.data);
  
      // Handle success or update the UI as needed
  
      // Load a new cat image by updating the key with a random string
      const newCatImageKey = Math.random().toString(36).substring(7);
      setCatImageKey(newCatImageKey);
      
      // Reactivate the buttons
      setVotingButtonsActive(true);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };  
  console.log(process.env.NEXT_PUBLIC_CAT_API_KEY)
  return (
    <div className="container mx-auto">
      <div className="w-full md:w-4/5 md:float-left relative">
        <RandomCatImage onImageLoad={(image) => setCatImage(image)} key={catImageKey} />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => handleVote(1)}
            className={`bg-white rounded-full p-2 shadow-md hover:shadow-lg transform hover:scale-110 transition duration-300 ${
              !votingButtonsActive && 'bg-gray-400 cursor-not-allowed'
            }`}
            style={{ bottom: '85px', right: '50px', zIndex: 1, position: 'absolute' }}
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
            style={{ bottom: '85px', right: '10px', zIndex: 1, position: 'absolute' }}
            title="Thumbs Down"
            disabled={!votingButtonsActive}
          >
            👎
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-700">More to come! Stay tuned!</p>
      </div>
      <div className="w-full md:w-1/5 md:float-left">
        <div className="p-4 hidden md:block">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Recent Posts</h2>
          <ul className="space-y-4">
            {recentPosts.map(({ _id, title = '', slug = '' }, index) => (
              <li key={_id}>
                <Link href={`/blog/${encodeURIComponent(slug.current)}`}>
                  <p className="text-sm">{title}</p>
                  <p className="text-xs text-gray-400">{formattedDates[index]}</p>
                </Link>
                {index !== recentPosts.length - 1 && <hr className="my-4" />}
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
  const query = `*[_type == "post"] | order(publishedAt desc) [0..4] {
    _id,
    title,
    slug,
    publishedAt
  }`;

  const recentPosts = await client.fetch<BlogPost[]>(query);

  return {
    props: {
      recentPosts,
    },
  };
};

export default Home;
