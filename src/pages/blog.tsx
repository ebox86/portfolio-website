import Link from 'next/link';
import { useEffect } from 'react';
import { GetStaticProps } from 'next';
import client from '../../sanityClient'; // Import the Sanity client instance
import imageUrlBuilder from '@sanity/image-url'; // Import imageUrlBuilder
import {toPlainText} from '@portabletext/react'

// Initialize imageUrlBuilder with your Sanity project settings
const builder = imageUrlBuilder(client);

interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
  mainImage: any;
  body: any;
}

interface BlogPageProps {
  posts: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  useEffect(() => {
    console.log('List of Blog Posts:', posts);
  }, [posts]);

  // Function to get the image URL
  const getImageUrl = (imageField: any) => {
    return builder.image(imageField).url() || '';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
      <ul className="mt-4 space-y-4">
        {posts.length > 0 &&
          posts.map(({ _id, title = '', slug = '', publishedAt = '', mainImage = '', body }) =>
            slug && (
              <Link key={_id} href={`/blog/${encodeURIComponent(slug.current)}`}>
                <li className="bg-white my-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="flex">
                    <img
                      src={getImageUrl(mainImage)} 
                      alt={title}
                      className="object-cover h-48 w-1/2 rounded-l-lg" 
                    />
                    <div className="p-4 w-1/2">
                      <h2 className="text-xl font-semibold cursor-pointer">{title}</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Published on {new Date(publishedAt).toDateString()}
                      </p>
                      <p className="text-gray-800 mt-2">
                        {toPlainText(body).length >= 100 ? toPlainText(body).slice(0, 100) + '...' : toPlainText(body) }
                      </p>
                    </div>
                  </div>
                </li>
              </Link>
            )
          )}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const query = `*[_type == "post"] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage,
  }`;

  const posts = await client.fetch<BlogPost[]>(query);

  return {
    props: {
      posts,
    },
  };
};

export default BlogPage;
