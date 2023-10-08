import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import RandomCatImage from '../components/RandomCatImage'; // Import the RandomCatImage component

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
  return (
    <div className="container mx-auto">
      <div className="w-full md:w-4/5 md:float-left">
        <RandomCatImage />
        <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-700">More to come! Stay tuned!</p>
      </div>
      <div className="w-full md:w-1/5 md:float-left">
        <div className="p-4 hidden md:block">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Recent Posts</h2>
          <ul className="space-y-4">
            {recentPosts.map(({ _id, title = '', slug = '', publishedAt = '' }, index) => (
              <li key={_id}>
                <Link href={`/blog/${encodeURIComponent(slug.current)}`}>
                  <p className="text-sm">{title}</p>
                  <p className="text-xs text-gray-400">{new Date(publishedAt).toDateString()}</p>
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
