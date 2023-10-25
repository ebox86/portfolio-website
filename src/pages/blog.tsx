import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
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
  initialData: BlogPost[];
}

const fetchPosts = async () => {
  const query = `*[_type == "post"] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage,
    categories[] -> {title, _id}
  }`;

  return await client.fetch<BlogPost[]>(query);
};

function urlFor(source: any) {
  return builder.image(source);
}

const BlogPage: React.FC<BlogPageProps> = ({ initialData }) => {
  const { data: posts } = useSWR('fetchPostsKey', fetchPosts, {
    initialData,
    revalidateOnFocus: false,
  });

  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Posts</h1>
      <ul className="mt-4 space-y-4">
        {initialData.length > 0 &&
          initialData.map(({ _id, title = '', slug = '', mainImage = '', categories, body }, index) =>
            slug && (
              <Link key={_id} href={`/blog/${encodeURIComponent(slug.current)}`}>
                <li className="bg-white my-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="flex">
                    <div className="relative w-1/2 h-48">
                      <Image
                        src={urlFor(mainImage).width(400).quality(80).url() || ''}
                        alt={title}
                        fill
                        placeholder="blur"
                        blurDataURL={urlFor(mainImage).width(20).quality(20).url() || ''}
                        className="rounded-l-lg"
                      />
                    </div>
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
                          {toPlainText(body).length >= 80
                            ? toPlainText(body).slice(0, 80) + '...'
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

export async function getStaticProps() {
  const posts = await fetchPosts();

  return {
    props: {
      initialData: posts,
    },
    revalidate: 600, // 10 minutes
  };
};

export default BlogPage;
