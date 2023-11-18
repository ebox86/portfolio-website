"use client";

import React from 'react';
import { PortableText } from '@portabletext/react'; 
import client from '../../../../sanityClient';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import CodeComponent from '../../../components/CodeComponent';
import Link from 'next/link';

const builder = imageUrlBuilder(client);

export interface BlogPost {
  _id: string;
  slug: any;
  title: string;
  body: any;
  mainImage: any;
  publishedAt: string;
}

function urlFor(source: any) {
  return builder.image(source);
}

const ImageComponent = (value: any) => {
  const imageUrl = urlFor(value.value).width(800).quality(80).url();
  const blurUrl = urlFor(value.value).width(20).quality(20).url();

  return (
    <div className="w-full h-96 relative rounded-lg shadow-md mb-4 overflow-hidden border border-black-200">
      <Image
        src={imageUrl}
        alt={value.alt || ' '}
        fill
        placeholder="blur"
        blurDataURL={blurUrl}
        className='object-cover'
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  )
}

const components = {
  types: {
    image: ImageComponent,
    code: CodeComponent as any,
  },
  marks: {
    code: (props: any) => <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-mono">{props.children}</span>,
    link: (props: any) => {
      const target = (props.value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <Link href={props.value?.href} target={target} className='text-blue-500 hover:text-blue-700'>
            {props.children}
        </Link>
      )
    },
  },
  list: {
    bullet: (props: any) => <ul className="list-disc pl-10 mb-4">{props.children}</ul>,
    number: (props: any) => <ol className="list-decimal pl-10 mb-4">{props.children}</ol>,
  },
  listItem: {
    bullet: (props: any) => <li className='mb-2' style={{listStyleType: 'disclosure-closed'}}>{props.children}</li>,
    number: (props: any) => <li className='mb-2'>{props.children}</li>,
  },
  block: {
    normal: (props: any) => <p className="mb-4 py-2 leading-7">{props.children}</p>,
    h1: (props: any) => <h1 className="text-4xl font-bold my-6">{props.children}</h1>,
    h2: (props: any) => <h2 className="text-3xl font-bold my-5">{props.children}</h2>,
    h3: (props: any) => <h3 className="text-2xl font-bold my-4">{props.children}</h3>,
    h4: (props: any) => <h4 className="text-xl font-bold my-3">{props.children}</h4>,
    blockquote: (props: any) => (
      <blockquote className="pl-2 py-2 border-l-2 border-black italic text-gray-700">{props.children}</blockquote>
    )
  },
};

const BlogPostPage: React.FC<BlogPost> = async (post) => {
  if (!post) {
    // Handle case where initialData is not available
    return <div>Error: Blog post not found!</div>;
  }
  return (
    <div className="bg-gray-100 mx-auto p-4">
      {post.mainImage && <ImageComponent value={post.mainImage} alt={post.title} />}
      <div className="mb-4">
        <h1 className="text-5xl font-semibold text-left ">{post.title}</h1>
        <p className="text-xs text-gray-400 pt-4">{new Date(post.publishedAt).toDateString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {post.body ? 
        (
          <PortableText value={post.body} components={components} />
        ) : (
          <p>No content available for this post.. i probably forgot to add a body.. <i>Opps</i></p>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;