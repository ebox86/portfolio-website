import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { toPlainText } from '@portabletext/react';

const builder = imageUrlBuilder(client);

interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
  mainImage: any;
  body: any;
  categories: any;
}

interface BlogPageProps {
  posts: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  useEffect(() => {
    console.log('List of Blog Posts:', posts);
  }, [posts]);

  const getImageUrl = (imageField: any) => {
    return builder.image(imageField).url() || '';
  };

  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  useEffect(() => {
    const formattedDatesArray = posts.map(({ publishedAt }) => {
      return new Date(publishedAt).toDateString();
    });
    setFormattedDates(formattedDatesArray);
  }, [posts]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
      <ul className="mt-4 space-y-4">
        {posts.length > 0 &&
          posts.map(({ _id, title = '', slug = '', mainImage = '', categories, body }, index) =>
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
                      <p className="text-gray-600 text-sm my-1">
                        Published on {formattedDates[index]}
                      </p>
                      {categories &&
                        categories.map(({ _id = '', title = '' }) => (
                          <span
                            key={_id}
                            className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                          >
                            {title}
                          </span>
                        ))}
                      {body && (
                        <p className="text-gray-800 mt-2">
                          {toPlainText(body).length >= 100
                            ? toPlainText(body).slice(0, 100) + '...'
                            : toPlainText(body)}
                        </p>
                      )}
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
    categories[] -> {title, _id}
  }`;

  const posts = await client.fetch<BlogPost[]>(query);

  return {
    props: {
      posts,
    },
  };
};

export default BlogPage;
