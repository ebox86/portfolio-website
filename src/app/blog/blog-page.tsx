"use client";

import Link from 'next/link';
import Image from 'next/image';
import client from '../../../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { toPlainText } from '@portabletext/react';

export interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
  mainImage: any;
  body: any;
  categories: any;
}

export interface BlogPageProps {
  posts: BlogPost[];
}

function urlFor(source: any) {
    return builder.image(source);
}

const builder = imageUrlBuilder(client);


const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Posts</h1>
      <ul className="mt-4 space-y-4">
        {posts.length > 0 &&
          posts.map(({ _id, title = '', slug = '', mainImage = '', categories, body, publishedAt }) =>
            slug && (
              <Link key={_id} href={`/blog/${encodeURIComponent(slug.current)}`}>
                <li className="bg-white my-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="flex">
                    <div className="relative w-1/2">
                      <Image
                        src={urlFor(mainImage).width(400).quality(80).url() || ''}
                        alt={title}
                        fill
                        placeholder="blur"
                        blurDataURL={urlFor(mainImage).width(20).quality(20).url() || ''}
                        className="rounded-l-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4 w-1/2">
                      <h2 className="text-xl font-semibold cursor-pointer">{title}</h2>
                      <p className="text-gray-600 text-sm my-1">
                          Published on {new Date(publishedAt).toLocaleDateString()}
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


export default BlogPage;
