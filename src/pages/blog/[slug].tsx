import React, { useMemo } from 'react';
import { PortableText } from '@portabletext/react'; 
import client from '../../../sanityClient';
import Image from 'next/image';
import CodeComponent from '../../components/CodeComponent';
import Link from 'next/link';
import { buildSanityImage } from '../../lib/sanityImage';
import { addInlineCodeMarks } from '../../lib/portableTextUtils';
import type { PortableTextBlock } from '@portabletext/types';

interface BlogPost {
  _id: string;
  slug: any;
  title: string;
  body?: PortableTextBlock[];
  mainImage: any;
  publishedAt: string;
  tags?: { _id: string; title?: string; slug?: { current: string } }[];
}

interface AdjacentPost {
  title: string;
  slug: { current: string };
  mainImage?: any;
}

interface BlogPostPageProps {
  initialData: BlogPost;
  prevPost?: AdjacentPost | null;
  nextPost?: AdjacentPost | null;
}

const ImageComponent = (value: any) => {
  const built = buildSanityImage(value.value, { width: 800 });

  return (
    <div className="w-full h-96 relative rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Image
        src={built?.url || ''}
        alt={value.alt || ' '}
        fill
        placeholder={built?.blurDataURL ? 'blur' : undefined}
        blurDataURL={built?.blurDataURL}
        className='object-cover'
        style={built?.objectPosition ? { objectPosition: built.objectPosition } : undefined}
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
    code: (props: any) => (
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-mono dark:bg-gray-800 dark:text-gray-100">
        {props.children}
      </span>
    ),
    link: (props: any) => {
      const target = (props.value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <Link
          href={props.value?.href}
          target={target}
          rel={target === '_blank' ? 'noreferrer' : undefined}
          className="text-blue-500 underline decoration-2 underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {props.children}
        </Link>
      );
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
    normal: (props: any) => <p className="mb-4 py-2 leading-7 text-gray-800 dark:text-gray-200">{props.children}</p>,
    h1: (props: any) => <h1 className="text-4xl font-bold my-6 text-gray-900 dark:text-white">{props.children}</h1>,
    h2: (props: any) => <h2 className="text-3xl font-bold my-5 text-gray-900 dark:text-white">{props.children}</h2>,
    h3: (props: any) => <h3 className="text-2xl font-bold my-4 text-gray-900 dark:text-white">{props.children}</h3>,
    h4: (props: any) => <h4 className="text-xl font-bold my-3 text-gray-900 dark:text-white">{props.children}</h4>,
    blockquote: (props: any) => (
      <blockquote className="pl-2 py-2 border-l-2 border-black italic text-gray-700 dark:text-gray-200 dark:border-gray-500">
        {props.children}
      </blockquote>
    )
  },
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ initialData, prevPost, nextPost }) => {
  const bodyWithInlineCode = useMemo<PortableTextBlock[] | undefined>(() => {
    if (!initialData?.body) return undefined;
    const result = addInlineCodeMarks(initialData.body);
    return result ?? initialData.body;
  }, [initialData?.body]);

  if (!initialData) {
    // Handle case where initialData is not available
    return <div>Error: Blog post not found!</div>;
  }

  const adjacentCard = (label: string, post: AdjacentPost | null | undefined) => {
    if (!post) return null;
    const cover = buildSanityImage(post.mainImage, { width: 200, height: 160 });
    return (
      <Link
        href={`/blog/${encodeURIComponent(post.slug.current)}`}
        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="relative w-20 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {cover ? (
            <Image
              src={cover.url}
              alt={post.title}
              fill
              className="object-cover"
              style={cover.objectPosition ? { objectPosition: cover.objectPosition } : undefined}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">{post.title}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen mx-auto p-4">
      {initialData.mainImage && <ImageComponent value={initialData.mainImage} alt={initialData.title} />}
      <div className="mb-4">
        <h1 className="text-5xl font-semibold text-left text-gray-900 dark:text-white">{initialData.title}</h1>
        {initialData.tags && initialData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3">
            {initialData.tags.map((tag) => (
              <span
                key={tag._id}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                {tag.title || tag.slug?.current || 'Tag'}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">{new Date(initialData.publishedAt).toDateString()}</p>
      </div>
      <div className="bg-white border border-gray-300 dark:bg-gray-900 dark:border dark:border-gray-700 rounded-lg shadow-md p-4">
        {initialData.body ? (
          <PortableText value={(bodyWithInlineCode ?? initialData.body) as PortableTextBlock[]} components={components} />
        ) : (
          <p>No content available for this post.. i probably forgot to add a body.. <i>Opps</i></p>
        )}
      </div>
      {(prevPost || nextPost) && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Keep reading</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {adjacentCard('Previous', prevPost)}
            {adjacentCard('Next', nextPost)}
          </div>
        </div>
      )}
    </div>
  );
};

export async function getStaticPaths() {
  const query = '*[_type == "post"].slug.current';
  const slugs = await client.fetch<string[]>(query);

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      ...,
      mainImage{
        asset->{_ref, url, metadata{lqip}},
        crop,
        hotspot
      },
      tags[]->{
        _id,
        title,
        "slug": slug.current
      },
      "prev": *[_type == "post" && publishedAt < ^.publishedAt] | order(publishedAt desc)[0]{
        title,
        slug,
        mainImage{
          asset->{_ref, url, metadata{lqip}},
          crop,
          hotspot
        }
      },
      "next": *[_type == "post" && publishedAt > ^.publishedAt] | order(publishedAt asc)[0]{
        title,
        slug,
        mainImage{
          asset->{_ref, url, metadata{lqip}},
          crop,
          hotspot
        }
      }
    }
  `;

  const postWithNeighbors = await client.fetch<BlogPost & { prev?: AdjacentPost; next?: AdjacentPost }>(query, { slug });

  return {
    props: {
      initialData: postWithNeighbors,
      prevPost: postWithNeighbors?.prev || null,
      nextPost: postWithNeighbors?.next || null,
    },
    revalidate: 600 // 10 mins
  };
}

export default BlogPostPage;
